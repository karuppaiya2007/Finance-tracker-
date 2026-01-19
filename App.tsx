
import React, { useState, useEffect } from 'react';
import { Transaction, Budget, SavingsGoal } from './types';
import { CURRENCY_SYMBOL } from './constants';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import ChatAssistant from './components/ChatAssistant';
import { getFinancialInsights } from './services/geminiService';
import { 
  Plus, 
  LayoutDashboard, 
  Receipt, 
  Target, 
  MessageSquare,
  Bell,
  Menu,
  ChevronRight,
  Lightbulb,
  Sparkles
} from 'lucide-react';

const STORAGE_KEY = 'artha_ai_transactions';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'chat'>('dashboard');
  const [insights, setInsights] = useState<{ insights: any[], summary: string } | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load transactions", e);
      }
    } else {
      // Default initial data if empty
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const initial = [
        { id: '1', type: 'income', category: 'Salary', amount: 45000, date: today, description: 'Monthly Salary' },
        { id: '2', type: 'expense', category: 'Food', amount: 1200, date: today, description: 'Dinner with friends' },
        { id: '3', type: 'expense', category: 'Rent', amount: 12000, date: yesterday, description: 'House Rent' },
        { id: '4', type: 'expense', category: 'Travel', amount: 500, date: yesterday, description: 'Fuel' },
      ];
      setTransactions(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  }, []);

  // Save transactions whenever they change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions]);

  const fetchInsights = async () => {
    if (transactions.length === 0) return;
    setIsLoadingInsights(true);
    const data = await getFinancialInsights(transactions, [], []);
    if (data) setInsights(data);
    setIsLoadingInsights(false);
  };

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Artha <span className="text-indigo-600">AI</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="hidden md:flex items-center gap-3 ml-4 border-l border-slate-200 pl-4">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">John Doe</p>
                <p className="text-xs text-slate-500">Savings Account</p>
              </div>
              <img src="https://picsum.photos/40/40" alt="Profile" className="w-10 h-10 rounded-full border-2 border-indigo-100 shadow-sm" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Action Tabs for Mobile */}
          <div className="flex md:hidden bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg ${activeTab === 'transactions' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
            >
              History
            </button>
          </div>

          {(activeTab === 'dashboard' || window.innerWidth > 768) && (
            <>
              <Dashboard transactions={transactions} />
              
              {/* AI Insights Bar */}
              <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-indigo-200" />
                    <span className="text-sm font-semibold uppercase tracking-wider opacity-80">Smart Insights</span>
                  </div>
                  <h2 className="text-xl font-bold mb-4">Let Artha analyze your spending</h2>
                  <button 
                    onClick={fetchInsights}
                    disabled={isLoadingInsights}
                    className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-colors disabled:opacity-50"
                  >
                    {isLoadingInsights ? 'Analyzing...' : 'Get AI Advice'}
                  </button>
                </div>

                {insights && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
                    {insights.insights.map((insight: any, i: number) => (
                      <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                        <p className="text-xs font-bold text-indigo-200 mb-1">{insight.title}</p>
                        <p className="text-sm text-white leading-relaxed">{insight.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Recent Transactions List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="text-indigo-600 text-sm font-bold hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {transactions.slice(0, 5).map((t) => (
                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {t.category[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{t.description}</p>
                      <p className="text-xs text-slate-500">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-bold ${
                    t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'
                  }`}>
                    {t.type === 'income' ? '+' : '-'} {CURRENCY_SYMBOL}{t.amount.toLocaleString()}
                  </p>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                  No transactions yet. Start by adding one!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Side Panels */}
        <div className="lg:col-span-4 space-y-8">
          {/* Quick Add Button Desktop */}
          <button 
            onClick={() => setIsFormOpen(true)}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus className="w-6 h-6" />
            Add Transaction
          </button>

          {/* AI Chat Bot */}
          <ChatAssistant transactions={transactions} onAddTransaction={addTransaction} />

          {/* Savings Progress */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Savings Goal</h3>
              <button className="text-indigo-600 font-bold text-xs uppercase tracking-wider">Set New</button>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-slate-700">Emergency Fund</span>
                  <span className="text-sm font-bold text-indigo-600">65%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-medium text-slate-500">
                  <span>Target: {CURRENCY_SYMBOL}1,00,000</span>
                  <span>Left: {CURRENCY_SYMBOL}35,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
            <h4 className="text-amber-800 font-bold flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4" /> Tip of the day
            </h4>
            <p className="text-sm text-amber-900/70 leading-relaxed">
              Automate your savings! Transfer at least 10% of your income to a separate account right after you get paid. You can't spend what you don't see.
            </p>
          </div>
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center md:hidden z-40"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between md:hidden z-40">
        <button onClick={() => setActiveTab('dashboard')} className={`p-2 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <LayoutDashboard className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('transactions')} className={`p-2 ${activeTab === 'transactions' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Receipt className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('chat')} className={`p-2 ${activeTab === 'chat' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <MessageSquare className="w-6 h-6" />
        </button>
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
          <img src="https://picsum.photos/40/40" alt="Profile" />
        </div>
      </nav>

      {isFormOpen && <TransactionForm onAdd={addTransaction} onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};

export default App;
