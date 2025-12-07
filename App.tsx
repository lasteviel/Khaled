import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import SheepManager from './components/SheepManager';
import HealthManager from './components/HealthManager';
import FinanceManager from './components/FinanceManager';
import AdvisorView from './components/AdvisorView';
import { LayoutGrid, Syringe, Banknote, Sparkles, Bell, X, AlertTriangle, Calendar, AlertCircle } from 'lucide-react';
import { getSheep, getEvents, getFeedStockStatus } from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('sheep');
  const [showNotifications, setShowNotifications] = useState(false);
  const [alerts, setAlerts] = useState<{type: 'warning'|'danger'|'info', message: string, icon: React.ReactNode}[]>([]);
  const [dataVersion, setDataVersion] = useState(0);

  const handleDataChange = () => {
    setDataVersion(prev => prev + 1);
  };

  useEffect(() => {
    const checkAlerts = () => {
        const sheep = getSheep();
        const events = getEvents();
        const stock = getFeedStockStatus();
        const newAlerts: {type: 'warning'|'danger'|'info', message: string, icon: React.ReactNode}[] = [];

        // 1. Stock Alerts
        if (stock === 'critical') {
          newAlerts.push({
            type: 'danger', 
            message: 'تنبيه: مخزون العلف حرج جداً!',
            icon: <AlertTriangle size={18} className="text-red-500" />
          });
        } else if (stock === 'low') {
          newAlerts.push({
            type: 'warning', 
            message: 'مخزون العلف منخفض، يرجى الشراء قريباً.',
            icon: <AlertTriangle size={18} className="text-amber-500" />
          });
        }

        // 2. Events (Next 3 days)
        const now = new Date();
        now.setHours(0,0,0,0);
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(now.getDate() + 3);
        
        events.forEach(e => {
            if(!e.isCompleted) {
                const eventDate = new Date(e.date);
                if (eventDate >= now && eventDate <= threeDaysFromNow) {
                     newAlerts.push({
                       type: 'info', 
                       message: `تذكير: ${e.title} يوم ${e.date}`,
                       icon: <Calendar size={18} className="text-blue-500" />
                     });
                }
                if (eventDate < now) {
                     newAlerts.push({
                       type: 'warning', 
                       message: `فائت: ${e.title} (${e.date})`,
                       icon: <AlertCircle size={18} className="text-red-400" />
                     });
                }
            }
        });
        
        // 3. Sick sheep
        const sickCount = sheep.filter(s => s.status === 'sick').length;
        if (sickCount > 0) {
          newAlerts.push({
            type: 'danger', 
            message: `يوجد ${sickCount} حالات مريضة تحتاج عناية.`,
            icon: <Syringe size={18} className="text-red-500" />
          });
        }

        setAlerts(newAlerts);
    };
    
    checkAlerts();
  }, [view, showNotifications, dataVersion]); 

  const renderView = () => {
    switch (view) {
      case 'sheep': return <SheepManager onDataChange={handleDataChange} />;
      case 'health': return <HealthManager onDataChange={handleDataChange} />;
      case 'finance': return <FinanceManager />;
      case 'advisor': return <AdvisorView />;
      default: return <SheepManager onDataChange={handleDataChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-right dir-rtl font-sans">
      
      {/* Notification Button */}
      <button 
        onClick={() => setShowNotifications(true)}
        className="fixed top-4 left-4 z-40 bg-white p-2.5 rounded-full shadow-lg border border-gray-100 text-gray-600 active:scale-95 transition"
      >
        <div className="relative">
          <Bell size={24} />
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          )}
        </div>
      </button>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 p-4" onClick={() => setShowNotifications(false)}>
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800">التنبيهات ({alerts.length})</h3>
              <button onClick={() => setShowNotifications(false)} className="bg-gray-100 p-1 rounded-full text-gray-500"><X size={20}/></button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-400 flex flex-col items-center">
                  <Bell size={48} className="mb-2 opacity-20" />
                  <p>لا توجد تنبيهات جديدة</p>
                </div>
              ) : (
                alerts.map((alert, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border flex items-start gap-3 ${
                    alert.type === 'danger' ? 'bg-red-50 border-red-100' : 
                    alert.type === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'
                  }`}>
                    <div className="mt-0.5">{alert.icon}</div>
                    <p className={`text-sm font-medium ${
                       alert.type === 'danger' ? 'text-red-800' : 
                       alert.type === 'warning' ? 'text-amber-800' : 'text-blue-800'
                    }`}>
                      {alert.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-md mx-auto min-h-screen relative bg-gray-100 shadow-2xl p-4">
        {renderView()}
      
        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 max-w-md mx-auto">
          <div className="flex justify-around items-center p-2">
            
            <button 
              onClick={() => setView('sheep')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${view === 'sheep' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400'}`}
            >
              <LayoutGrid size={24} strokeWidth={view === 'sheep' ? 2.5 : 2} />
              <span className="text-xs font-bold">القطيع</span>
            </button>

            <button 
              onClick={() => setView('health')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${view === 'health' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
            >
              <Syringe size={24} strokeWidth={view === 'health' ? 2.5 : 2} />
              <span className="text-xs font-bold">الصحة</span>
            </button>

            <button 
              onClick={() => setView('finance')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${view === 'finance' ? 'text-amber-600 bg-amber-50' : 'text-gray-400'}`}
            >
              <Banknote size={24} strokeWidth={view === 'finance' ? 2.5 : 2} />
              <span className="text-xs font-bold">المالية</span>
            </button>
            
             <button 
              onClick={() => setView('advisor')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${view === 'advisor' ? 'text-purple-600 bg-purple-50' : 'text-gray-400'}`}
            >
              <Sparkles size={24} strokeWidth={view === 'advisor' ? 2.5 : 2} />
              <span className="text-xs font-bold">المستشار</span>
            </button>

          </div>
        </nav>
      </main>
    </div>
  );
};

export default App;