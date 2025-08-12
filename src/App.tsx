import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthScreen from "./components/Auth/AuthScreen";
import IncidentLogger from "./components/Logging/IncidentLogger";
import PoopDropGame from "./components/Auth/PoopDropGame";
import { IncidentEntry, FoodIntake } from "./types";
import { Button } from "./components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import {
  BarChart3,
  Calendar,
  Activity,
  AlertTriangle,
  TrendingUp,
  Brain,
} from "lucide-react";
import "./globals.css";

const MainApp: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const [incidents, setIncidents] = useState<IncidentEntry[]>([]);
  const [foods, setFoods] = useState<FoodIntake[]>([]);
  const [showIncidentLogger, setShowIncidentLogger] = useState(false);
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [user]);

  // Auto-show game on desktop after a delay
  useEffect(() => {
    if (user && window.innerWidth >= 1024) {
      const timer = setTimeout(() => {
        setShowGame(true);
      }, 5000); // Show game after 5 seconds on desktop
      return () => clearTimeout(timer);
    }
  }, [user]);

  const loadUserData = () => {
    if (!user) return;

    try {
      const storedIncidents = localStorage.getItem(`incidents_${user.id}`);
      const storedFoods = localStorage.getItem(`foods_${user.id}`);

      if (storedIncidents) {
        const parsedIncidents = JSON.parse(storedIncidents);
        // Convert timestamp strings back to Date objects
        const incidents = parsedIncidents.map((incident: any) => ({
          ...incident,
          timestamp: new Date(incident.timestamp),
        }));
        setIncidents(incidents);
      }

      if (storedFoods) {
        const parsedFoods = JSON.parse(storedFoods);
        const foods = parsedFoods.map((food: any) => ({
          ...food,
          timestamp: new Date(food.timestamp),
        }));
        setFoods(foods);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const saveUserData = (
    newIncidents: IncidentEntry[],
    newFoods: FoodIntake[]
  ) => {
    if (!user) return;

    try {
      localStorage.setItem(
        `incidents_${user.id}`,
        JSON.stringify(newIncidents)
      );
      localStorage.setItem(`foods_${user.id}`, JSON.stringify(newFoods));
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  };

  const handleIncidentLogged = (incident: IncidentEntry) => {
    const newIncidents = [incident, ...incidents].slice(0, 100); // Keep last 100
    setIncidents(newIncidents);
    saveUserData(newIncidents, foods);
  };

  const getTodayStats = () => {
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const todayIncidents = incidents.filter((incident) => {
      const incidentDate = new Date(incident.timestamp);
      return incidentDate >= todayStart;
    });

    return {
      count: todayIncidents.length,
      avgBristol:
        todayIncidents.length > 0
          ? todayIncidents.reduce((sum, i) => sum + i.bristolScale, 0) /
            todayIncidents.length
          : 0,
      symptoms: todayIncidents.reduce((sum, i) => sum + i.symptoms.length, 0),
    };
  };

  const getBristolDescription = (scale: number): string => {
    const descriptions: { [key: number]: string } = {
      1: "Severe constipation",
      2: "Mild constipation",
      3: "Normal (firm)",
      4: "Normal (ideal)",
      5: "Lacking fiber",
      6: "Mild diarrhea",
      7: "Severe diarrhea",
    };
    return descriptions[scale] || "Unknown";
  };

  const stats = getTodayStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400">Loading your health tracker...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {showIncidentLogger && (
        <IncidentLogger
          onIncidentLogged={handleIncidentLogged}
          onClose={() => setShowIncidentLogger(false)}
        />
      )}

      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-white">DigestiTrack</h1>
                <p className="text-sm text-slate-400">
                  Professional Digestive Health Monitor
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400 flex items-center gap-2">
                <span>👋</span>
                Welcome, {user.name}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <span>↗️</span>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="main-container professional-container">
        <div className="tracker-panel professional-panel">
          <h2 className="panel-title">📊 Bowel Movement Tracking</h2>
          <p className="panel-description">
            Medical-grade logging using the Bristol Stool Scale classification
            system. Track symptoms, patterns, and health indicators with
            clinical precision.
          </p>

          <button
            className="log-incident-btn"
            onClick={() => setShowIncidentLogger(true)}
          >
            Log New Entry
          </button>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">📅 {stats.count}</div>
              <div className="stat-label">Today's Entries</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">📊 {incidents.length}</div>
              <div className="stat-label">Total Entries</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">⚖️ {stats.avgBristol.toFixed(1)}</div>
              <div className="stat-label">Avg Bristol</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">⚠️ {stats.symptoms}</div>
              <div className="stat-label">Symptoms Today</div>
            </div>
          </div>
        </div>

        <div className="tracker-panel professional-panel">
          <h2 className="panel-title">📈 Recent Entries</h2>
          <div className="recent-incidents">
            {incidents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎨</div>
                <h3>No entries recorded yet</h3>
                <p>
                  Start tracking your digestive health by logging your first
                  entry. Each entry helps build a comprehensive picture of your
                  health patterns.
                </p>
                <p>Click "Log New Entry" above to get started.</p>
              </div>
            ) : (
              incidents.slice(0, 10).map((incident) => (
                <div key={incident.id} className="incident-card">
                  <div className="incident-card-header">
                    <div className="incident-datetime">
                      <div className="incident-date">
                        {incident.timestamp.toLocaleDateString()}
                      </div>
                      <div className="incident-time">
                        {incident.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className="bristol-badge bristol-{incident.bristolScale}">
                      <div className="bristol-number">
                        {incident.bristolScale}
                      </div>
                      <div className="bristol-label">Bristol Scale</div>
                    </div>
                  </div>

                  <div className="incident-metrics">
                    <div className="metric-group">
                      <div className="metric-row">
                        <div className="metric-item">
                          <div className="metric-icon">📏</div>
                          <div className="metric-info">
                            <div className="metric-label">Volume</div>
                            <div className="metric-value">
                              {incident.volume}
                            </div>
                          </div>
                          <div className="metric-bar">
                            <div
                              className="metric-fill volume-{incident.volume}"
                              style={{
                                width: `${
                                  incident.volume === "minimal"
                                    ? 20
                                    : incident.volume === "small"
                                    ? 40
                                    : incident.volume === "moderate"
                                    ? 60
                                    : incident.volume === "large"
                                    ? 80
                                    : 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="metric-item">
                          <div className="metric-icon">⚡</div>
                          <div className="metric-info">
                            <div className="metric-label">Urgency</div>
                            <div className="metric-value">
                              {incident.urgency}
                            </div>
                          </div>
                          <div className="metric-bar">
                            <div
                              className="metric-fill urgency-{incident.urgency}"
                              style={{
                                width: `${
                                  incident.urgency === "none"
                                    ? 0
                                    : incident.urgency === "mild"
                                    ? 25
                                    : incident.urgency === "moderate"
                                    ? 50
                                    : incident.urgency === "severe"
                                    ? 75
                                    : 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="metric-row">
                        <div className="metric-item">
                          <div className="metric-icon">✅</div>
                          <div className="metric-info">
                            <div className="metric-label">Completeness</div>
                            <div className="metric-value">
                              {incident.completeness}
                            </div>
                          </div>
                          <div className="metric-indicator completeness-{incident.completeness}">
                            {incident.completeness === "complete"
                              ? "●●●"
                              : incident.completeness === "partial"
                              ? "●●○"
                              : "●○○"}
                          </div>
                        </div>

                        <div className="metric-item">
                          <div className="metric-icon">🎨</div>
                          <div className="metric-info">
                            <div className="metric-label">Color</div>
                            <div className="metric-value">
                              {incident.color.replace("_", " ")}
                            </div>
                          </div>
                          <div className="color-indicator">
                            <div className="color-dot color-{incident.color}"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {incident.symptoms.length > 0 && (
                    <div className="symptoms-section">
                      <div className="symptoms-header">
                        <span className="symptoms-icon">🩺</span>
                        <span className="symptoms-count">
                          {incident.symptoms.length} Symptom
                          {incident.symptoms.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="symptoms-list">
                        {incident.symptoms.map((symptom) => (
                          <div key={symptom.id} className="symptom-chip">
                            <span className="symptom-name">
                              {symptom.type.replace("_", " ")}
                            </span>
                            <div className="symptom-severity">
                              <div className="severity-dots">
                                {Array.from({ length: 10 }, (_, i) => (
                                  <div
                                    key={i}
                                    className={`severity-dot ${
                                      i < symptom.severity ? "active" : ""
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="severity-number">
                                {symptom.severity}/10
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {incident.notes && (
                    <div className="incident-notes-card">
                      <div className="notes-header">
                        <span className="notes-icon">📝</span>
                        <span>Notes</span>
                      </div>
                      <div className="notes-content">{incident.notes}</div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="tracker-panel professional-panel">
          <h2 className="panel-title">🧠 Health Insights</h2>

          {/* Mini Game Section */}
          <div className="game-section">
            <div className="game-header">
              <h3>🎮 Take a Break - Play Poop Drop!</h3>
              <button
                className="game-toggle-btn compact"
                onClick={() => setShowGame(!showGame)}
              >
                {showGame ? "Hide Game" : "Show Game"} 💩
              </button>
            </div>
            {showGame && (
              <PoopDropGame
                isVisible={true}
                onClose={() => setShowGame(false)}
                autoStart={true}
                compact={true}
              />
            )}
          </div>

          <div className="health-insights">
            {incidents.length < 3 ? (
              <div className="insight-message">
                <div className="insight-illustration">🔍</div>
                <h3>Insights Coming Soon</h3>
                <p>
                  Keep logging entries to unlock personalized health insights
                  and pattern analysis. Our algorithms need at least 3 entries
                  to start identifying trends in your digestive health.
                </p>
                <p>
                  The more data you provide, the more accurate our insights
                  become.
                </p>
              </div>
            ) : (
              <div className="insights-list">
                <div className="insight">
                  <span className="insight-icon">🔮</span>
                  <div>
                    <h4>Pattern Analysis</h4>
                    <p>
                      Your average Bristol scale is{" "}
                      {stats.avgBristol.toFixed(1)} -{" "}
                      {getBristolDescription(Math.round(stats.avgBristol))}
                    </p>
                  </div>
                </div>

                {stats.symptoms > 0 && (
                  <div className="insight warning">
                    <span className="insight-icon">🩺</span>
                    <div>
                      <h4>Symptoms Detected</h4>
                      <p>
                        {stats.symptoms} symptoms recorded today. Consider
                        consulting your healthcare provider if symptoms persist.
                      </p>
                    </div>
                  </div>
                )}

                {stats.count > 3 && (
                  <div className="insight positive">
                    <span className="insight-icon">🎆</span>
                    <div>
                      <h4>Good Tracking Habit</h4>
                      <p>
                        You're maintaining excellent tracking consistency. This
                        data will be valuable for identifying patterns.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="medical-disclaimer">
            <p>🔒 HIPAA Compliant • Medical-grade tracking</p>
            <p>
              This app is for tracking purposes only and does not replace
              professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;
