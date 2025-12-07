import React, { useState, useEffect } from 'react';
import { Sheep, HealthStatus } from '../types';
import { Plus, Search, Filter, Stethoscope, CheckCircle, AlertCircle } from 'lucide-react';
import { getSheep, saveSheep } from '../services/storageService';

interface SheepManagerProps {
  onDataChange?: () => void;
}

const SheepManager: React.FC<SheepManagerProps> = ({ onDataChange }) => {
  const [sheepList, setSheepList] = useState<Sheep[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | HealthStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [newTagId, setNewTagId] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newStatus, setNewStatus] = useState<HealthStatus>('healthy');
  const [newGender, setNewGender] = useState<'male' | 'female'>('female');

  useEffect(() => {
    setSheepList(getSheep());
  }, []);

  const handleAddSheep = (e: React.FormEvent) => {
    e.preventDefault();
    const newSheep: Sheep = {
      id: Date.now().toString(),
      tagId: newTagId,
      age: Number(newAge),
      status: newStatus,
      gender: newGender,
    };
    const updatedList = [newSheep, ...sheepList];
    setSheepList(updatedList);
    saveSheep(updatedList);
    if (onDataChange) onDataChange();
    setShowAddForm(false);
    setNewTagId('');
    setNewAge('');
  };

  const updateStatus = (id: string, status: HealthStatus) => {
    const updatedList = sheepList.map(s => s.id === id ? { ...s, status } : s);
    setSheepList(updatedList);
    saveSheep(updatedList);
    if (onDataChange) onDataChange();
  };

  const filteredSheep = sheepList.filter(s => {
    const matchesFilter = filter === 'all' || s.status === filter;
    const matchesSearch = s.tagId.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: HealthStatus) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'sick': return 'bg-red-100 text-red-800 border-red-200';
      case 'treatment': return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const getStatusLabel = (status: HealthStatus) => {
    switch (status) {
      case 'healthy': return 'سليم';
      case 'sick': return 'مريض';
      case 'treatment': return 'علاج';
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-emerald-800">سجل الأغنام</h2>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-emerald-600 text-white p-2 rounded-full shadow-lg hover:bg-emerald-700 transition"
          >
            <Plus size={24} />
          </button>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="بحث برقم القرط..." 
              className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
          <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}>الكل ({sheepList.length})</button>
          <button onClick={() => setFilter('healthy')} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'healthy' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>سليم</button>
          <button onClick={() => setFilter('sick')} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'sick' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}>مريض</button>
          <button onClick={() => setFilter('treatment')} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'treatment' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700'}`}>تحت العلاج</button>
        </div>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-4 text-gray-800">إضافة رأس جديد</h3>
            <form onSubmit={handleAddSheep} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">رقم القرط (Tag ID)</label>
                <input required type="text" value={newTagId} onChange={e => setNewTagId(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">العمر (أشهر)</label>
                  <input required type="number" value={newAge} onChange={e => setNewAge(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">الجنس</label>
                  <select value={newGender} onChange={e => setNewGender(e.target.value as any)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <option value="female">أنثى (نعجة)</option>
                    <option value="male">ذكر (فحل/طلي)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">الحالة الصحية</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value as HealthStatus)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <option value="healthy">سليم</option>
                  <option value="sick">مريض</option>
                  <option value="treatment">تحت العلاج</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-3 text-gray-600 bg-gray-100 rounded-xl font-bold">إلغاء</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid gap-3">
        {filteredSheep.map((sheep) => (
          <div key={sheep.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-gray-800">#{sheep.tagId}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(sheep.status)}`}>
                  {getStatusLabel(sheep.status)}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                 {sheep.gender === 'male' ? 'ذكر' : 'أنثى'} • {sheep.age} شهر
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => updateStatus(sheep.id, 'healthy')}
                className={`p-2 rounded-full ${sheep.status === 'healthy' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}
              >
                <CheckCircle size={20} />
              </button>
              <button 
                onClick={() => updateStatus(sheep.id, 'treatment')}
                className={`p-2 rounded-full ${sheep.status === 'treatment' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'}`}
              >
                <Stethoscope size={20} />
              </button>
              <button 
                onClick={() => updateStatus(sheep.id, 'sick')}
                className={`p-2 rounded-full ${sheep.status === 'sick' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'}`}
              >
                <AlertCircle size={20} />
              </button>
            </div>
          </div>
        ))}
        {filteredSheep.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p>لا توجد أغنام مطابقة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SheepManager;