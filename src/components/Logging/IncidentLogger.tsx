import React, { useState } from 'react';
import { IncidentEntry, Symptom } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface IncidentLoggerProps {
  onIncidentLogged: (incident: IncidentEntry) => void;
  onClose: () => void;
}

const IncidentLogger: React.FC<IncidentLoggerProps> = ({ onIncidentLogged, onClose }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [incident, setIncident] = useState<Partial<IncidentEntry>>({
    bristolScale: 4,
    volume: 'moderate',
    urgency: 'mild',
    completeness: 'complete',
    consistency: 'normal',
    color: 'brown',
    location: 'home',
    symptoms: [],
    isPrivate: true,
    shareWithHealthcare: false
  });

  const [currentSymptom, setCurrentSymptom] = useState<Partial<Symptom>>({
    type: 'abdominal_pain',
    severity: 1,
    duration: 0
  });

  const bristolDescriptions = {
    1: 'Separate hard lumps (severe constipation)',
    2: 'Lumpy and sausage-like (mild constipation)', 
    3: 'A sausage shape with cracks in the surface',
    4: 'Like a smooth, soft sausage or snake (normal)',
    5: 'Soft blobs with clear-cut edges',
    6: 'Mushy consistency with ragged edges',
    7: 'Liquid consistency, no solid pieces (diarrhea)'
  };

  const symptomTypes = [
    { value: 'abdominal_pain', label: 'Abdominal Pain' },
    { value: 'bloating', label: 'Bloating' },
    { value: 'gas', label: 'Excessive Gas' },
    { value: 'nausea', label: 'Nausea' },
    { value: 'cramping', label: 'Cramping' },
    { value: 'urgency', label: 'Urgency' },
    { value: 'incomplete_evacuation', label: 'Incomplete Evacuation' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = () => {
    if (!user) return;

    const newIncident: IncidentEntry = {
      id: generateId(),
      userId: user.id,
      timestamp: new Date(),
      bristolScale: incident.bristolScale!,
      volume: incident.volume!,
      urgency: incident.urgency!,
      completeness: incident.completeness!,
      consistency: incident.consistency!,
      color: incident.color!,
      location: incident.location!,
      symptoms: incident.symptoms!,
      notes: incident.notes,
      isPrivate: incident.isPrivate!,
      shareWithHealthcare: incident.shareWithHealthcare!
    };

    onIncidentLogged(newIncident);
    onClose();
  };

  const addSymptom = () => {
    if (currentSymptom.type && currentSymptom.severity) {
      const newSymptom: Symptom = {
        id: generateId(),
        type: currentSymptom.type,
        severity: currentSymptom.severity,
        duration: currentSymptom.duration || 0,
        location: currentSymptom.location,
        description: currentSymptom.description
      };

      setIncident({
        ...incident,
        symptoms: [...(incident.symptoms || []), newSymptom]
      });

      setCurrentSymptom({
        type: 'abdominal_pain',
        severity: 1,
        duration: 0
      });
    }
  };

  const removeSymptom = (symptomId: string) => {
    setIncident({
      ...incident,
      symptoms: incident.symptoms?.filter(s => s.id !== symptomId)
    });
  };

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  return (
    <div className="incident-logger-overlay">
      <div className="incident-logger">
        <div className="logger-header">
          <h2>Log Bowel Movement</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="logger-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
          <span>Step {currentStep} of 4</span>
        </div>

        <div className="logger-content">
          {currentStep === 1 && (
            <div className="step-content">
              <h3>Bristol Stool Scale Classification</h3>
              <p>Select the type that best matches your bowel movement:</p>
              
              <div className="bristol-scale">
                {[1, 2, 3, 4, 5, 6, 7].map(scale => (
                  <label key={scale} className="bristol-option">
                    <input
                      type="radio"
                      name="bristolScale"
                      value={scale}
                      checked={incident.bristolScale === scale}
                      onChange={(e) => setIncident({
                        ...incident, 
                        bristolScale: parseInt(e.target.value) as any
                      })}
                    />
                    <div className="bristol-card">
                      <div className="bristol-number">Type {scale}</div>
                      <div className="bristol-description">
                        {bristolDescriptions[scale as keyof typeof bristolDescriptions]}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-content">
              <h3>Physical Characteristics</h3>
              
              <div className="characteristics-grid">
                <div className="char-group">
                  <label>Volume</label>
                  <select
                    value={incident.volume}
                    onChange={(e) => setIncident({
                      ...incident, 
                      volume: e.target.value as any
                    })}
                  >
                    <option value="minimal">Minimal</option>
                    <option value="small">Small</option>
                    <option value="moderate">Moderate</option>
                    <option value="large">Large</option>
                    <option value="excessive">Excessive</option>
                  </select>
                </div>

                <div className="char-group">
                  <label>Urgency</label>
                  <select
                    value={incident.urgency}
                    onChange={(e) => setIncident({
                      ...incident, 
                      urgency: e.target.value as any
                    })}
                  >
                    <option value="none">None</option>
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div className="char-group">
                  <label>Completeness</label>
                  <select
                    value={incident.completeness}
                    onChange={(e) => setIncident({
                      ...incident, 
                      completeness: e.target.value as any
                    })}
                  >
                    <option value="incomplete">Incomplete</option>
                    <option value="partial">Partial</option>
                    <option value="complete">Complete</option>
                  </select>
                </div>

                <div className="char-group">
                  <label>Color</label>
                  <select
                    value={incident.color}
                    onChange={(e) => setIncident({
                      ...incident, 
                      color: e.target.value as any
                    })}
                  >
                    <option value="brown">Brown (normal)</option>
                    <option value="light_brown">Light Brown</option>
                    <option value="dark_brown">Dark Brown</option>
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                    <option value="red">Red</option>
                    <option value="black">Black</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-content">
              <h3>Associated Symptoms</h3>
              
              <div className="symptom-tracker">
                <div className="add-symptom">
                  <div className="symptom-form">
                    <select
                      value={currentSymptom.type}
                      onChange={(e) => setCurrentSymptom({
                        ...currentSymptom,
                        type: e.target.value as any
                      })}
                    >
                      {symptomTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>

                    <div className="severity-slider">
                      <label>Severity: {currentSymptom.severity}/10</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={currentSymptom.severity}
                        onChange={(e) => setCurrentSymptom({
                          ...currentSymptom,
                          severity: parseInt(e.target.value) as any
                        })}
                      />
                    </div>

                    <div className="duration-input">
                      <label>Duration (minutes)</label>
                      <input
                        type="number"
                        min="0"
                        value={currentSymptom.duration}
                        onChange={(e) => setCurrentSymptom({
                          ...currentSymptom,
                          duration: parseInt(e.target.value)
                        })}
                      />
                    </div>

                    <button type="button" onClick={addSymptom} className="add-btn">
                      Add Symptom
                    </button>
                  </div>
                </div>

                <div className="symptoms-list">
                  {incident.symptoms?.map(symptom => (
                    <div key={symptom.id} className="symptom-item">
                      <span className="symptom-name">
                        {symptomTypes.find(t => t.value === symptom.type)?.label}
                      </span>
                      <span className="symptom-severity">
                        Severity: {symptom.severity}/10
                      </span>
                      {symptom.duration > 0 && (
                        <span className="symptom-duration">
                          {symptom.duration} min
                        </span>
                      )}
                      <button 
                        className="remove-btn"
                        onClick={() => removeSymptom(symptom.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="step-content">
              <h3>Context & Privacy</h3>
              
              <div className="context-form">
                <div className="form-group">
                  <label>Location</label>
                  <select
                    value={incident.location}
                    onChange={(e) => setIncident({
                      ...incident,
                      location: e.target.value as any
                    })}
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="public">Public</option>
                    <option value="healthcare">Healthcare Facility</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Additional Notes (optional)</label>
                  <textarea
                    value={incident.notes || ''}
                    onChange={(e) => setIncident({
                      ...incident,
                      notes: e.target.value
                    })}
                    placeholder="Any additional details..."
                    rows={3}
                  />
                </div>

                <div className="privacy-options">
                  <label className="privacy-option">
                    <input
                      type="checkbox"
                      checked={incident.isPrivate}
                      onChange={(e) => setIncident({
                        ...incident,
                        isPrivate: e.target.checked
                      })}
                    />
                    Keep this entry private
                  </label>

                  <label className="privacy-option">
                    <input
                      type="checkbox"
                      checked={incident.shareWithHealthcare}
                      onChange={(e) => setIncident({
                        ...incident,
                        shareWithHealthcare: e.target.checked
                      })}
                    />
                    Allow sharing with healthcare providers
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="logger-actions">
          {currentStep > 1 && (
            <button 
              className="btn secondary" 
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Previous
            </button>
          )}
          
          {currentStep < 4 ? (
            <button 
              className="btn primary" 
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
            </button>
          ) : (
            <button 
              className="btn primary" 
              onClick={handleSubmit}
            >
              Log Entry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentLogger;