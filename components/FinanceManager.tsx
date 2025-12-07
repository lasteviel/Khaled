import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { Plus, TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { getTransactions, saveTransactions } from '../services/storageService';

const FinanceManager: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form
  const [newType, setNewType] = useState<'sale' | 'purchase' | 'expense'>('expense');
  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrans: Transaction = {
      id: Date.now().toString(),
      type: newType,
      amount: Number(newAmount),
      date: newDate,
      notes: newNotes
    };
    const updated = [newTrans, ...transactions];
    setTransactions(updated);
    saveTransactions(updated);
    setShowForm(false);
    setNewAmount('');
    setNewNotes('');
  };

  const income = transactions.filter(t => t.type === 'sale').reduce((acc, curr) => acc + curr.amount, 0);
  const expense = transactions.filter(t => t.type !== 'sale').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - expense;

  return (
    <div className="space-y-4 pb-24">
      <div className="bg-white p-4 rounded-2xl shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-amber-800">المالية</h2>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-amber-600 text-white p-2 rounded-full shadow-lg hover:bg-amber-700 transition"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-1 text-emerald-600 mb-1">
              <TrendingUp size={16} />
              <span className="text-xs font-bold">مبيعات</span>
            </div>
            <p className="text-lg font-bold text-emerald-800">{income.toLocaleString()} <span className="text-xs">ريال</span></p>
          </div>
          <div className="bg-red-50 p-3 rounded-xl border border-red-100">
            <div className="flex items-center gap-1 text-red-600 mb-1">
              <TrendingDown size={16} />
              <span className="text-xs font-bold">مصروفات</span>
            </div>
            <p className="text-lg font-bold text-red-800">{expense.toLocaleString()} <span className="text-xs">ريال</span></p>
          </div>
        </div>
        <div className="mt-2 bg-gray-900 text-white p-3 rounded-xl flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <Wallet size={18} className="text-amber-400" />
            <span className="text-sm">الرصيد الصافي</span>
          </div>
          <span className={`text-xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {balance > 0 ? '+' : ''}{balance.toLocaleString()}
          </span>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">معاملة مالية جديدة</h3>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <button type="button" onClick={() => setNewType('sale')} className={`py-2 rounded-xl text-sm font-bold ${newType === 'sale' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}>بيع</button>
                <button type="button" onClick={() => setNewType('purchase')} className={`py-2 rounded-xl text-sm font-bold ${newType === 'purchase' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}>شراء</button>
                <button type="button" onClick={() => setNewType('expense')} className={`py-2 rounded-xl text-sm font-bold ${newType === 'expense' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'}`}>مصروف</button>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">المبلغ (ريال)</label>
                <input required type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" placeholder="0" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">التاريخ</label>
                <input required type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">ملاحظات (اختياري)</label>
                <input type="text" value={newNotes} onChange={e => setNewNotes(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" placeholder="مثال: شراء برسيم" />
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 text-gray-600 bg-gray-100 rounded-xl font-bold">إلغاء</button>
                <button type="submit" className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-bold shadow-lg">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="space-y-2">
        {transactions.map(t => (
          <div key={t.id} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-opacity-10 ${t.type === 'sale' ? 'bg-emerald-500 text-emerald-600' : 'bg-red-500 text-red-600'}`}>
                <DollarSign size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{t.type === 'sale' ? 'مبيعات' : t.type === 'purchase' ? 'شراء أغنام' : 'مصروفات'}</h4>
                <p className="text-xs text-gray-500">{t.date} • {t.notes || 'بدون ملاحظات'}</p>
              </div>
            </div>
            <span className={`font-bold dir-ltr ${t.type === 'sale' ? 'text-emerald-600' : 'text-red-600'}`}>
              {t.type === 'sale' ? '+' : '-'}{t.amount.toLocaleString()}
            </span>
          </div>
        ))}
         {transactions.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p>لا توجد معاملات</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceManager;
