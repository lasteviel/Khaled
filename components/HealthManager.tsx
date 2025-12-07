import React, { useState, useEffect } from 'react';
import { CalendarEvent, FeedStockStatus } from '../types';
import { Calendar, CheckSquare, Square, Plus, Syringe, Wheat, AlertTriangle, Battery, BatteryMedium, BatteryWarning } from 'lucide-react';
import { getEvents, saveEvents, getFeedStockStatus, saveFeedStockStatus } from '../services/storageService';

interface HealthManagerProps {
  onDataChange?: () => void;
}

const HealthManager: React.FC<HealthManagerProps> = ({ onDataChange }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [stockStatus, setStockStatus] = useState<FeedStockStatus>('good');
  const [showForm, setShowForm] = useState(false);

  // Form
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState<'vaccine' | 'feed'>('vaccine');

  useEffect(() => {
    setEvents(getEvents());
    setStockStatus(getFeedStockStatus());
  }, []);

  const handleStockChange = (status: FeedStockStatus) => {
    setStockStatus(status);
    saveFeedStockStatus(status);
    if (onDataChange) onDataChange();
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: newTitle,
      date: newDate,
      type: newType,
      isCompleted: false,
    };
    const updated = [...events, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setEvents(updated);
    saveEvents(updated);
    if (onDataChange) onDataChange();
    setShowForm(false);
    setNewTitle('');
    setNewDate('');
  };

  const toggleComplete = (id: string) => {
    const updated = events.map(e => e.id === id ? { ...e, isCompleted: !e.isCompleted } : e);
    setEvents(updated);
    saveEvents(updated);
    if (onDataChange) onDataChange();
  };

  const upcomingEvents = events.filter(e => !e.isCompleted);
  const completedEvents = events.filter(e => e.isCompleted);

  return (
    <div className="space-y-4 pb-24">
      <div className="bg-white p-4 rounded-2xl shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-800">الصحة والتغذية</h2>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Feed Stock Status */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Wheat size={20} className="text-amber-500"/>
          مستوى مخزون العلف
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => handleStockChange('good')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition ${stockStatus === 'good' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
          >
            <Battery size={24} className={stockStatus === 'good' ? 'fill-emerald-500 text-emerald-500' : ''} />
            <span className="text-sm font-bold mt-1">متوفر</span>
          </button>
          
          <button 
            onClick={() => handleStockChange('low')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition ${stockStatus === 'low' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
          >
            <BatteryMedium size={24} className={stockStatus === 'low' ? 'fill-amber-500 text-amber-500' : ''} />
            <span className="text-sm font-bold mt-1">منخفض</span>
          </button>

          <button 
            onClick={() => handleStockChange('critical')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition ${stockStatus === 'critical' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
          >
            <BatteryWarning size={24} className={stockStatus === 'critical' ? 'fill-red-500 text-red-500' : ''} />
            <span className="text-sm font-bold mt-1">حرج</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">تسجيل حدث جديد</h3>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div className="flex gap-2 mb-4">
                <button type="button" onClick={() => setNewType('vaccine')} className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 border ${newType === 'vaccine' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200'}`}>
                  <Syringe size={18} /> تطعيم
                </button>
                <button type="button" onClick={() => setNewType('feed')} className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 border ${newType === 'feed' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'border-gray-200'}`}>
                  <Wheat size={18} /> تغذية
                </button>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">اسم التطعيم/العلف</label>
                <input required type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" placeholder="مثال: تطعيم معوي" />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">التاريخ</label>
                <input required type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" />
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 text-gray-600 bg-gray-100 rounded-xl font-bold">إلغاء</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Timeline / List */}
      <div className="space-y-2">
        <h3 className="text-gray-500 text-sm font-bold pr-2">المهام القادمة</h3>
        {upcomingEvents.length === 0 && <p className="text-gray-400 text-sm pr-2">لا توجد مهام قادمة</p>}
        {upcomingEvents.map(event => (
          <div key={event.id} className="bg-white p-4 rounded-xl border-r-4 border-blue-500 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${event.type === 'vaccine' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                {event.type === 'vaccine' ? <Syringe size={20} /> : <Wheat size={20} />}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{event.title}</h4>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar size={14} />
                  <span>{event.date}</span>
                </div>
              </div>
            </div>
            <button onClick={() => toggleComplete(event.id)} className="text-gray-300 hover:text-green-500">
              <Square size={28} strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>

      {completedEvents.length > 0 && (
        <div className="space-y-2 mt-6">
          <h3 className="text-gray-500 text-sm font-bold pr-2">مكتملة</h3>
          {completedEvents.map(event => (
            <div key={event.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between opacity-75">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-200 text-gray-500">
                  {event.type === 'vaccine' ? <Syringe size={18} /> : <Wheat size={18} />}
                </div>
                <div>
                  <h4 className="font-medium text-gray-600 line-through">{event.title}</h4>
                  <span className="text-xs text-gray-400">{event.date}</span>
                </div>
              </div>
              <button onClick={() => toggleComplete(event.id)} className="text-emerald-500">
                <CheckSquare size={24} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthManager;