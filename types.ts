export type HealthStatus = 'healthy' | 'sick' | 'treatment';

export type FeedStockStatus = 'good' | 'low' | 'critical';

export interface Sheep {
  id: string;
  tagId: string;
  age: number; // in months
  status: HealthStatus;
  gender: 'male' | 'female';
  notes?: string;
}

export interface Transaction {
  id: string;
  type: 'sale' | 'purchase' | 'expense';
  amount: number;
  date: string;
  notes?: string;
}

export interface CalendarEvent {
  id: string;
  type: 'vaccine' | 'feed';
  title: string;
  date: string;
  isCompleted: boolean;
  details?: string;
}

export type ViewState = 'dashboard' | 'sheep' | 'health' | 'finance' | 'advisor';