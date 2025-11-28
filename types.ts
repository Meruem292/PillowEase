export enum MassageMode {
  KNEADING = 'KNEADING',
  SHIATSU = 'SHIATSU',
  PULSE = 'PULSE',
  WAVE = 'WAVE',
  AI_ADAPTIVE = 'AI_ADAPTIVE'
}

export enum HeatLevel {
  OFF = 'OFF',
  LOW = 'LOW',
  HIGH = 'HIGH'
}

export interface DeviceState {
  isOn: boolean;
  isConnected: boolean;
  mode: MassageMode;
  intensity: number; // 0-100
  heat: HeatLevel;
  timer: number; // minutes remaining
}

export interface AIRecommendation {
  mode: MassageMode;
  intensity: number;
  heat: HeatLevel;
  duration: number;
  reasoning: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
}