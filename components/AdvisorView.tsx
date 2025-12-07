import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { getSheep, getTransactions, getEvents } from '../services/storageService';
import { analyzeFarmStatus } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const AdvisorView: React.FC = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const sheep = getSheep();
    const transactions = getTransactions();
    const events = getEvents();
    
    const result = await analyzeFarmStatus(sheep, transactions, events);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-purple-600" size={24} />
          <h2 className="text-2xl font-bold text-purple-900">المستشار الذكي</h2>
        </div>
        <p className="text-gray-600 mb-6">احصل على تحليل فوري لحالة مزرعتك ونصائح لتحسين الإنتاجية باستخدام الذكاء الاصطناعي.</p>
        
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> جاري التحليل...
            </>
          ) : (
            <>
              حلل بيانات مزرعتي
            </>
          )}
        </button>
      </div>

      {analysis && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 animate-fade-in">
          <h3 className="font-bold text-lg mb-3 text-gray-800 border-b pb-2">تقرير المستشار:</h3>
          <div className="prose prose-purple prose-sm max-w-none text-gray-700 leading-relaxed">
             <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        </div>
      )}
      
      {!analysis && !loading && (
        <div className="text-center p-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          اضغط على الزر أعلاه للحصول على تقرير
        </div>
      )}
    </div>
  );
};

export default AdvisorView;
