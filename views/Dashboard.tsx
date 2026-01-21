
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, ShoppingBag, Users, AlertCircle, Sparkles, 
  ArrowUpRight, ArrowDownRight, Package, Target, Calendar,
  Trophy, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { getBusinessInsights } from '../services/geminiService';
import { INITIAL_PRODUCTS, INITIAL_MEMBERS } from '../constants';

const SALES_TRENDS = {
  DAILY: [
    { name: '08:00', sales: 1200 }, { name: '10:00', sales: 2400 }, { name: '12:00', sales: 5800 },
    { name: '14:00', sales: 3200 }, { name: '16:00', sales: 4500 }, { name: '18:00', sales: 8900 },
    { name: '20:00', sales: 6200 }, { name: '22:00', sales: 1500 },
  ],
  WEEKLY: [
    { name: 'Sen', sales: 4000, profit: 2400 }, { name: 'Sel', sales: 3000, profit: 1398 },
    { name: 'Rab', sales: 2000, profit: 9800 }, { name: 'Kam', sales: 2780, profit: 3908 },
    { name: 'Jum', sales: 1890, profit: 4800 }, { name: 'Sab', sales: 2390, profit: 3800 },
    { name: 'Min', sales: 3490, profit: 4300 },
  ],
  MONTHLY: [
    { name: 'Jan', sales: 45000 }, { name: 'Feb', sales: 52000 }, { name: 'Mar', sales: 48000 },
    { name: 'Apr', sales: 61000 }, { name: 'Mei', sales: 55000 }, { name: 'Jun', sales: 67000 },
  ]
};

const TOP_PRODUCTS = [
  { name: 'Nasi Goreng Spesial', sales: 124, revenue: 3100000, trend: 'up' },
  { name: 'Es Teh Manis', sales: 98, revenue: 490000, trend: 'up' },
  { name: 'Kopi Susu Aren', sales: 76, revenue: 1368000, trend: 'down' },
  { name: 'Chiki Balls', sales: 45, revenue: 360000, trend: 'up' },
];

const BOTTOM_PRODUCTS = [
  { name: 'Penghapus Karet', sales: 2, stock: 45 },
  { name: 'Buku Gambar A3', sales: 5, stock: 12 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [aiInsight, setAiInsight] = useState<string>('Menganalisa data bisnis Anda...');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const fetchInsight = async () => {
    setIsLoadingInsight(true);
    const dataSummary = {
      period,
      salesData: SALES_TRENDS[period],
      topItems: TOP_PRODUCTS,
      lowStock: 7,
      totalMembers: INITIAL_MEMBERS.length
    };
    const insight = await getBusinessInsights(JSON.stringify(dataSummary));
    setAiInsight(insight || 'Belum ada data cukup.');
    setIsLoadingInsight(false);
  };

  useEffect(() => {
    fetchInsight();
  }, [period]);

  const stats = [
    { label: 'Penjualan Hari Ini', value: 'Rp 4.520.000', change: '+12.5%', isUp: true, icon: <ShoppingBag className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Member Baru', value: '24', change: '+5.2%', isUp: true, icon: <Users className="text-indigo-600" />, bg: 'bg-indigo-50' },
    { label: 'Laba Bersih (Bulan)', value: 'Rp 12.250.000', change: '-2.1%', isUp: false, icon: <TrendingUp className="text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Stok Kritis', value: '7 Item', change: 'Cek Segera', isUp: false, icon: <AlertCircle className="text-amber-600" />, bg: 'bg-amber-50' },
  ];

  const memberSegments = [
    { name: 'Aktif', value: 65 },
    { name: 'Pasif', value: 25 },
    { name: 'Baru', value: 10 },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group active:scale-[0.98]">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-2xl group-hover:scale-110 transition-transform shadow-inner`}>{stat.icon}</div>
              <div className={`flex items-center text-[10px] md:text-xs font-black px-2 py-1 rounded-full ${stat.isUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                {stat.isUp ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</h3>
            <p className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Sales Trends Chart */}
        <div className="lg:col-span-2 bg-white p-5 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-6">
            <div>
              <h3 className="font-black text-xl md:text-2xl text-slate-800 tracking-tight">Tren Penjualan</h3>
              <p className="text-slate-400 text-sm font-medium">Visualisasi performa pendapatan harian</p>
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto">
              {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                    period === p ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {p === 'DAILY' ? 'Hari' : p === 'WEEKLY' ? 'Minggu' : 'Bulan'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[250px] md:h-[350px] w-full -ml-4 md:ml-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_TRENDS[period]}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                  tickFormatter={(value) => `Rp ${(value / 1000)}k`}
                />
                <Tooltip 
                  cursor={{stroke: '#4f46e5', strokeWidth: 2}}
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px'}}
                  formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Total']}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#4f46e5" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gemini AI Summary (Compact on Mobile) */}
        <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800 rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
            <Sparkles size={160} />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-xl ring-1 ring-white/20">
                <Target size={24} className="text-yellow-300 shadow-sm" />
              </div>
              <h3 className="font-black text-xl md:text-2xl tracking-tight">AI Insights</h3>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-8 flex-1 border border-white/10 flex flex-col justify-center">
              {isLoadingInsight ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-10">
                  <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin shadow-lg"></div>
                  <p className="text-xs font-black uppercase tracking-widest opacity-60">Menganalisa Data...</p>
                </div>
              ) : (
                <p className="text-indigo-50 leading-relaxed italic text-sm md:text-lg font-medium">
                  "{aiInsight}"
                </p>
              )}
            </div>
            
            <button 
              onClick={fetchInsight}
              disabled={isLoadingInsight}
              className="w-full bg-white text-indigo-700 font-black py-4.5 rounded-2xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 shadow-xl"
            >
              <Sparkles size={20} />
              RE-ANALYZE DATA
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 pb-10">
         {/* Top Products */}
        <div className="bg-white p-5 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2.5 rounded-2xl text-amber-600 shadow-inner">
                <Trophy size={20} />
              </div>
              <h3 className="font-black text-lg text-slate-800 uppercase tracking-tight">Best Sellers</h3>
            </div>
          </div>
          <div className="space-y-4">
            {TOP_PRODUCTS.map((prod, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-lg transition-all active:scale-[0.98]">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-slate-300 shadow-sm border border-slate-100 shrink-0">
                    {i + 1}
                  </div>
                  <div className="truncate">
                    <h5 className="font-black text-slate-800 text-sm truncate">{prod.name}</h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{prod.sales} Unit Terjual</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-slate-900 text-sm">Rp {prod.revenue.toLocaleString()}</p>
                  <div className={`flex items-center justify-end text-[10px] font-black ${prod.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {prod.trend === 'up' ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                    {prod.trend === 'up' ? 'TRENDING' : 'STABLE'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Summary (Mobile Friendly Table) */}
        <div className="bg-white p-5 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-rose-100 p-2.5 rounded-2xl text-rose-600 shadow-inner">
              <AlertTriangle size={20} />
            </div>
            <h3 className="font-black text-lg text-slate-800 uppercase tracking-tight">Perlu Perhatian</h3>
          </div>
          <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0">
            <table className="w-full min-w-[350px]">
              <thead className="bg-slate-50/50">
                <tr className="text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <th className="p-4 rounded-l-2xl">Produk</th>
                  <th className="p-4 text-center">Stok</th>
                  <th className="p-4 text-right rounded-r-2xl">Rekomendasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {BOTTOM_PRODUCTS.map((prod, i) => (
                  <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-700 text-sm">{prod.name}</td>
                    <td className="p-4 text-center">
                      <span className={`text-sm font-black ${prod.stock < 15 ? 'text-rose-500' : 'text-slate-600'}`}>{prod.stock}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="bg-white border border-slate-200 text-indigo-600 text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-sm hover:shadow-md transition-all">PROMOSI</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden group active:scale-[0.98] transition-transform">
             <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Package size={100} />
             </div>
             <div className="relative z-10">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total SKU Terdaftar</p>
               <h4 className="text-4xl font-black mb-1">{INITIAL_PRODUCTS.length} <span className="text-lg text-slate-500">Items</span></h4>
               <div className="flex items-center gap-2 text-emerald-400 text-xs font-black">
                  <CheckCircle2 size={14} />
                  LOGISTIK OPTIMAL
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
