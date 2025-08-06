import React, { useEffect, useState } from 'react';

interface FrogProps {
  id: number;
  onCroak: () => void;
}

const PsychedelicFrog: React.FC<FrogProps> = ({ id, onCroak }) => {
  const [position, setPosition] = useState({
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
  });

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
      });
    }, 8000 + Math.random() * 4000);

    return () => clearInterval(moveInterval);
  }, []);

  const handleClick = () => {
    onCroak();
    // Create ripple effect
    const frog = document.getElementById(`frog-${id}`);
    if (frog) {
      frog.style.transform = 'scale(1.5)';
      setTimeout(() => {
        frog.style.transform = 'scale(1)';
      }, 200);
    }
  };

  return (
    <div
      id={`frog-${id}`}
      className="psychedelic-frog"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        animationDelay: `${id * 0.5}s`,
      }}
      onClick={handleClick}
      title="Click me for a psychedelic croak!"
    />
  );
};

export default PsychedelicFrog;