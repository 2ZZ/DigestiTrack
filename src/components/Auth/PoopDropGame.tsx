import React, { useState, useEffect, useCallback, useRef } from "react";

interface PoopItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  emoji: string;
  points: number;
}

interface PoopDropGameProps {
  isVisible: boolean;
  onClose: () => void;
  autoStart?: boolean;
  compact?: boolean; // New prop for smaller box mode
}

const POOP_EMOJIS = [
  { emoji: "💩", points: 10 },
  { emoji: "🧻", points: 20 },
  { emoji: "🚽", points: 30 },
  { emoji: "💊", points: 50 },
];

const PoopDropGame: React.FC<PoopDropGameProps> = ({
  isVisible,
  onClose,
  autoStart = false,
  compact = false,
}) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameRunning, setGameRunning] = useState(false);
  const [poopItems, setPoopItems] = useState<PoopItem[]>([]);
  const [playerX, setPlayerX] = useState(50);
  const [gameOver, setGameOver] = useState(false);
  const [catchAnimation, setCatchAnimation] = useState(false);
  const [playerLevel, setPlayerLevel] = useState(0);
  const [levelUpNotification, setLevelUpNotification] = useState<string | null>(
    null
  );
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("digestitrack-poop-highscore") || "0");
  });

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<NodeJS.Timeout>();
  const spawnTimerRef = useRef<NodeJS.Timeout>();
  const nextId = useRef(0);

  const getPlayerIcon = useCallback(() => {
    const level = Math.floor(score / 50); // Faster level progression - every 50 points
    const icons = ["🚽", "🏆", "👑", "💎", "🌟", "🔥", "⚡", "🎯", "🎪", "🎭"];
    return icons[Math.min(level, icons.length - 1)] || "🚽";
  }, [score]);

  const startGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setGameRunning(true);
    setGameOver(false);
    setPoopItems([]);
    setPlayerX(50);
    setPlayerLevel(0);
    setCatchAnimation(false);
  }, []);

  const endGame = useCallback(() => {
    setGameRunning(false);
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("digestitrack-poop-highscore", score.toString());
    }
  }, [score, highScore]);

  const spawnPoop = useCallback(() => {
    if (!gameRunning) return;

    const randomPoop =
      POOP_EMOJIS[Math.floor(Math.random() * POOP_EMOJIS.length)];
    const newPoop: PoopItem = {
      id: nextId.current++,
      x: Math.random() * 90,
      y: -5,
      speed: 1 + Math.random() * 2,
      emoji: randomPoop.emoji,
      points: randomPoop.points,
    };

    setPoopItems((prev) => [...prev, newPoop]);
  }, [gameRunning]);

  const updateGame = useCallback(() => {
    if (!gameRunning) return;

    setPoopItems((prev) => {
      const updated = prev.map((poop) => ({
        ...poop,
        y: poop.y + poop.speed,
      }));

      // Check collisions with player
      const playerWidth = 8;
      const playerLeft = playerX - playerWidth / 2;
      const playerRight = playerX + playerWidth / 2;
      const playerTop = 85;
      const playerBottom = 95;

      let newScore = score;
      let newLives = lives;
      const remaining: PoopItem[] = [];

      updated.forEach((poop) => {
        const poopLeft = poop.x;
        const poopRight = poop.x + 5;
        const poopTop = poop.y;
        const poopBottom = poop.y + 5;

        // Check collision
        if (
          poopLeft < playerRight &&
          poopRight > playerLeft &&
          poopTop < playerBottom &&
          poopBottom > playerTop
        ) {
          // Collision detected
          newScore += poop.points;
          setCatchAnimation(true);
          setTimeout(() => setCatchAnimation(false), 300);
        } else if (poop.y > 100) {
          // Poop fell off screen
          if (poop.emoji === "💩") {
            newLives -= 1;
          }
        } else {
          // Keep the poop
          remaining.push(poop);
        }
      });

      setScore(newScore);
      setLives(newLives);

      // Update player level based on score
      const newLevel = Math.floor(newScore / 50); // Faster level progression
      if (newLevel !== playerLevel) {
        setPlayerLevel(newLevel);
        if (newLevel > 0) {
          const levelNames = [
            "Toilet Rookie",
            "Poop Pro",
            "Flush Master",
            "Bathroom Boss",
            "Digestive Deity",
            "Toilet Titan",
            "Poop Legend",
            "Flush God",
            "Ultimate Toilet Master",
          ];
          setLevelUpNotification(
            `Level Up! ${
              levelNames[Math.min(newLevel - 1, levelNames.length - 1)]
            }`
          );
          setTimeout(() => setLevelUpNotification(null), 2000);
        }
      }

      if (newLives <= 0) {
        setTimeout(() => endGame(), 100);
      }

      return remaining;
    });
  }, [gameRunning, playerX, score, lives, endGame]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          setPlayerX((prev) => Math.max(5, prev - 5));
          break;
        case "ArrowRight":
        case "d":
        case "D":
          setPlayerX((prev) => Math.min(95, prev + 5));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameRunning]);

  // Game loop
  useEffect(() => {
    if (gameRunning) {
      animationRef.current = setInterval(updateGame, 50);
      spawnTimerRef.current = setInterval(spawnPoop, 800); // Faster spawn rate
    } else {
      if (animationRef.current) clearInterval(animationRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    }

    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [gameRunning, updateGame, spawnPoop]);

  // Auto-start game on desktop
  useEffect(() => {
    if (isVisible && autoStart && !gameRunning && !gameOver) {
      const timer = setTimeout(() => {
        startGame();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoStart, gameRunning, gameOver, startGame]);

  if (!isVisible) return null;

  // Render compact version without overlay
  if (compact) {
    return (
      <div className="poop-game-container compact-container">
        <div className="poop-game-header">
          <h3>💩 Poop Drop Game 💩</h3>
          <button
            className="poop-game-close"
            onClick={onClose}
            aria-label="Close game"
          >
            ✕
          </button>
        </div>

        <div className="poop-game-stats">
          <div>Score: {score}</div>
          <div>Lives: {"❤️".repeat(lives)}</div>
          <div>High Score: {highScore}</div>
        </div>

        <div className="poop-game-area" ref={gameAreaRef}>
          {/* Player */}
          <div
            className={`poop-player ${
              catchAnimation ? "catch-animation" : ""
            } player-level-${playerLevel}`}
            style={{ left: `${playerX}%`, bottom: "5%" }}
          >
            {getPlayerIcon()}
          </div>

          {/* Falling poop items */}
          {poopItems.map((poop) => (
            <div
              key={poop.id}
              className="poop-item"
              style={{
                left: `${poop.x}%`,
                top: `${poop.y}%`,
              }}
            >
              {poop.emoji}
            </div>
          ))}

          {/* Level up notification */}
          {levelUpNotification && (
            <div className="level-up-notification">{levelUpNotification}</div>
          )}

          {/* Game over screen */}
          {gameOver && (
            <div className="poop-game-over">
              <h4>Game Over!</h4>
              <p>Final Score: {score}</p>
              {score === highScore && <p>🎉 New High Score! 🎉</p>}
              <button onClick={startGame} className="poop-game-button">
                Play Again
              </button>
            </div>
          )}

          {/* Start screen */}
          {!gameRunning && !gameOver && (
            <div className="poop-game-start">
              <h4>Welcome to Poop Drop!</h4>
              <p>Catch the falling items with your toilet 🚽</p>
              <p>💩 = 10 pts | 🧻 = 20 pts | 🚽 = 30 pts | 💊 = 50 pts</p>
              <p>Don't let the 💩 hit the ground!</p>
              <p>Use ← → arrow keys or A/D to move</p>
              <button onClick={startGame} className="poop-game-button">
                Start Game
              </button>
            </div>
          )}
        </div>

        <div className="poop-game-instructions">
          <p>Take a break and play while tracking your health! 🎮</p>
        </div>
      </div>
    );
  }

  // Render full-screen version with overlay
  return (
    <div className="poop-game-overlay">
      <div className="poop-game-container">
        <div className="poop-game-header">
          <h3>💩 Poop Drop Game 💩</h3>
          <button
            className="poop-game-close"
            onClick={onClose}
            aria-label="Close game"
          >
            ✕
          </button>
        </div>

        <div className="poop-game-stats">
          <div>Score: {score}</div>
          <div>Lives: {"❤️".repeat(lives)}</div>
          <div>High Score: {highScore}</div>
        </div>

        <div className="poop-game-area" ref={gameAreaRef}>
          {/* Player */}
          <div
            className={`poop-player ${
              catchAnimation ? "catch-animation" : ""
            } player-level-${playerLevel}`}
            style={{ left: `${playerX}%`, bottom: "5%" }}
          >
            {getPlayerIcon()}
          </div>

          {/* Falling poop items */}
          {poopItems.map((poop) => (
            <div
              key={poop.id}
              className="poop-item"
              style={{
                left: `${poop.x}%`,
                top: `${poop.y}%`,
              }}
            >
              {poop.emoji}
            </div>
          ))}

          {/* Level up notification */}
          {levelUpNotification && (
            <div className="level-up-notification">{levelUpNotification}</div>
          )}

          {/* Game over screen */}
          {gameOver && (
            <div className="poop-game-over">
              <h4>Game Over!</h4>
              <p>Final Score: {score}</p>
              {score === highScore && <p>🎉 New High Score! 🎉</p>}
              <button onClick={startGame} className="poop-game-button">
                Play Again
              </button>
            </div>
          )}

          {/* Start screen */}
          {!gameRunning && !gameOver && (
            <div className="poop-game-start">
              <h4>Welcome to Poop Drop!</h4>
              <p>Catch the falling items with your toilet 🚽</p>
              <p>💩 = 10 pts | 🧻 = 20 pts | 🚽 = 30 pts | 💊 = 50 pts</p>
              <p>Don't let the 💩 hit the ground!</p>
              <p>Use ← → arrow keys or A/D to move</p>
              <button onClick={startGame} className="poop-game-button">
                Start Game
              </button>
            </div>
          )}
        </div>

        <div className="poop-game-instructions">
          <p>While you wait to log in, why not play a quick game? 🎮</p>
        </div>
      </div>
    </div>
  );
};

export default PoopDropGame;
