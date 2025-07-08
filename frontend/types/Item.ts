export interface Item {
  id: string;
  moduleId: string;
  text: string;
  completed: boolean;
  timeframe?: string;
  createdAt: Date;
} 