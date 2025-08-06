export interface User {
  id: string;
  email: string;
  name: string;
  dateOfBirth?: Date;
  medicalConditions?: string[];
  medications?: string[];
  createdAt: Date;
  lastLoginAt: Date;
}

export interface IncidentEntry {
  id: string;
  userId: string;
  timestamp: Date;
  
  // Medical-grade classifications
  bristolScale: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  volume: 'minimal' | 'small' | 'moderate' | 'large' | 'excessive';
  urgency: 'none' | 'mild' | 'moderate' | 'severe' | 'emergency';
  completeness: 'incomplete' | 'partial' | 'complete';
  
  // Characteristics
  consistency: 'liquid' | 'loose' | 'soft' | 'normal' | 'hard' | 'very_hard';
  color: 'brown' | 'light_brown' | 'dark_brown' | 'green' | 'yellow' | 'red' | 'black' | 'other';
  
  // Associated symptoms
  symptoms: Symptom[];
  
  // Context
  location: 'home' | 'work' | 'public' | 'healthcare' | 'other';
  notes?: string;
  
  // Privacy and medical
  isPrivate: boolean;
  shareWithHealthcare: boolean;
}

export interface Symptom {
  id: string;
  type: 'abdominal_pain' | 'bloating' | 'gas' | 'nausea' | 'cramping' | 'urgency' | 'incomplete_evacuation' | 'other';
  severity: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  duration: number; // minutes
  location?: 'upper_abdomen' | 'lower_abdomen' | 'left_side' | 'right_side' | 'central' | 'whole_abdomen';
  description?: string;
}

export interface FoodIntake {
  id: string;
  userId: string;
  timestamp: Date;
  foodItems: FoodItem[];
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink';
  notes?: string;
}

export interface FoodItem {
  name: string;
  category: 'dairy' | 'gluten' | 'meat' | 'vegetable' | 'fruit' | 'grain' | 'legume' | 'nut' | 'spice' | 'beverage' | 'processed' | 'other';
  quantity?: string;
  brand?: string;
}

export interface UserProfile {
  user: User;
  preferences: {
    notifications: boolean;
    reminderFrequency: 'none' | 'daily' | 'weekly';
    dataRetention: '3_months' | '6_months' | '1_year' | 'indefinite';
    shareWithResearch: boolean;
  };
  healthcareProviders: HealthcareProvider[];
}

export interface HealthcareProvider {
  id: string;
  name: string;
  specialty: string;
  email?: string;
  hasAccess: boolean;
  accessLevel: 'view_only' | 'full_access';
  lastShared?: Date;
}

export interface AnalyticsData {
  patterns: {
    frequencyByDay: { [key: string]: number };
    commonTriggers: { food: string; correlation: number }[];
    symptomCorrelations: { symptom: string; frequency: number }[];
    timePatterns: { hour: number; frequency: number }[];
  };
  trends: {
    weeklyAverage: number;
    monthlyChange: number;
    improvementScore: number;
  };
  insights: {
    message: string;
    type: 'positive' | 'neutral' | 'concern';
    actionable: boolean;
  }[];
}

export interface ExportData {
  userId: string;
  dateRange: { start: Date; end: Date };
  incidents: IncidentEntry[];
  foods: FoodIntake[];
  summary: {
    totalIncidents: number;
    avgFrequency: number;
    commonSymptoms: string[];
    suspectedTriggers: string[];
  };
  generatedAt: Date;
}