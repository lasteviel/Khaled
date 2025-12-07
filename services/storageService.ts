import { Sheep, Transaction, CalendarEvent, FeedStockStatus } from '../types';

const SHEEP_KEY = 'myfarm_sheep';
const TRANS_KEY = 'myfarm_transactions';
const EVENTS_KEY = 'myfarm_events';
const STOCK_KEY = 'myfarm_stock_status';

// Initial Mock Data to help the user understand the app
const initialSheep: Sheep[] = [
  { id: '1', tagId: '101', age: 12, status: 'healthy', gender: 'female' },
  { id: '2', tagId: '102', age: 24, status: 'sick', gender: 'female', notes: 'سعال خفيف' },
  { id: '3', tagId: '103', age: 6, status: 'healthy', gender: 'male' },
  { id: '4', tagId: '104', age: 36, status: 'treatment', gender: 'female', notes: 'تحت المضاد الحيوي' },
];

const initialEvents: CalendarEvent[] = [
  { id: '1', type: 'vaccine', title: 'تطعيم جدري', date: new Date().toISOString().split('T')[0], isCompleted: false, details: 'القطيع بالكامل' },
  { id: '2', type: 'feed', title: 'شراء شعير', date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], isCompleted: false },
];

const initialTransactions: Transaction[] = [
  { id: '1', type: 'expense', amount: 500, date: '2023-10-01', notes: 'شراء أعلاف' },
  { id: '2', type: 'sale', amount: 1200, date: '2023-10-15', notes: 'بيع خروف' },
];

export const getSheep = (): Sheep[] => {
  const data = localStorage.getItem(SHEEP_KEY);
  return data ? JSON.parse(data) : initialSheep;
};

export const saveSheep = (sheep: Sheep[]) => {
  localStorage.setItem(SHEEP_KEY, JSON.stringify(sheep));
};

export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(TRANS_KEY);
  return data ? JSON.parse(data) : initialTransactions;
};

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(TRANS_KEY, JSON.stringify(transactions));
};

export const getEvents = (): CalendarEvent[] => {
  const data = localStorage.getItem(EVENTS_KEY);
  return data ? JSON.parse(data) : initialEvents;
};

export const saveEvents = (events: CalendarEvent[]) => {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
};

export const getFeedStockStatus = (): FeedStockStatus => {
  return (localStorage.getItem(STOCK_KEY) as FeedStockStatus) || 'good';
};

export const saveFeedStockStatus = (status: FeedStockStatus) => {
  localStorage.setItem(STOCK_KEY, status);
};