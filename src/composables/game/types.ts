export type CoinType = "coin" | "gold" | "bomb";

export interface Coin {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: CoinType;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

export interface RewardEvent {
  id: number;
  score: number;
  timestamp: number;
}

export interface DifficultySettings {
  coinCount: number;
  minSpeed: number;
  maxSpeed: number;
  goldChance: number;
  bombChance: number;
}