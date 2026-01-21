
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  TrendingUp, ShoppingBag, Users, AlertCircle, Sparkles, 
  ArrowUpRight, ArrowDownRight, Package, Target, Calendar,
  Trophy, AlertTriangle
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
    { label: 'Stok Kritis', value: '7 Item', change: 'Segera Cek', isUp: false, icon: <AlertCircle className="text-amber-600" />, bg: 'bg-amber-50' },
  ];

  const memberSegments = [
    { name: 'Aktif', value: 65 },
    { name: 'Pasif', value: 25 },
    { name: 'Baru', value: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-xl group-hover:scale-110 transition-transform`}>{stat.icon}</div>
              <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.isUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                {stat.isUp ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Advanced Sales Trends Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="font-black text-xl text-slate-800">Analisis Tren Penjualan</h3>
              <p className="text-slate-400 text-sm">Visualisasi performa pendapatan berdasarkan waktu</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    period === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {p === 'DAILY' ? 'Harian' : p === 'WEEKLY' ? 'Mingguan' : 'Bulanan'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_TRENDS[period]}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  tickFormatter={(value) => `Rp ${(value / 1000).toLocaleString()}k`}
                />
                <Tooltip 
                  cursor={{stroke: '#4f46e5', strokeWidth: 2}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Penjualan']}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#4f46e5" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gemini AI Summary */}
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex-1">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
              <Sparkles size={160} />
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                  <Target size={24} className="text-yellow-300" />
                </div>
                <h3 className="font-black text-xl">Gemini Business AI</h3>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-6 flex-1 border border-white/10">
                {isLoadingInsight ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-60">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">Memproses data...</p>
                  </div>
                ) : (
                  <p className="text-indigo-50 leading-relaxed italic text-sm md:text-base">
                    "{aiInsight}"
                  </p>
                )}
              </div>
              
              <button 
                onClick={fetchInsight}
                disabled={isLoadingInsight}
                className="w-full bg-white text-indigo-700 font-black py-4 rounded-2xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <Sparkles size={18} />
                Generate Strategi Baru
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products Analytics */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                <Trophy size={20} />
              </div>
              <h3 className="font-black text-lg text-slate-800">Produk Terlaris (Top Performers)</h3>
            </div>
            <button className="text-xs font-bold text-indigo-600 hover:underline">Lihat Semua</button>
          </div>
          <div className="space-y-4">
            {TOP_PRODUCTS.map((prod, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-md hover:border-indigo-100 border border-transparent transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-slate-400 shadow-sm border border-slate-100">
                    #{i + 1}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">{prod.name}</h5>
                    <p className="text-xs text-slate-400">{prod.sales} Terjual</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">Rp {prod.revenue.toLocaleString()}</p>
                  <div className={`flex items-center justify-end text-[10px] font-bold ${prod.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {prod.trend === 'up' ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                    {prod.trend === 'up' ? 'Meningkat' : 'Menurun'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Segmentation & Loyalty */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-violet-100 p-2 rounded-xl text-violet-600">
              <Users size={20} />
            </div>
            <h3 className="font-black text-lg text-slate-800">Segmentasi Pelanggan</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={memberSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={200}
                >
                  {memberSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '12px', fontWeight: 'bold'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-violet-50 rounded-2xl border border-violet-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-violet-700">Rata-rata Poin per Member</span>
              <span className="text-sm font-black text-violet-900">850 Poin</span>
            </div>
            <div className="w-full bg-violet-200 h-2 rounded-full overflow-hidden">
              <div className="bg-violet-600 h-full w-[70%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Health & Bottom Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-rose-100 p-2 rounded-xl text-rose-600">
              <AlertTriangle size={20} />
            </div>
            <h3 className="font-black text-lg text-slate-800">Produk Kurang Laku (Perlu Perhatian)</h3>
          </div>
          <div className="overflow-hidden border border-slate-100 rounded-2xl">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="p-4">Produk</th>
                  <th className="p-4 text-center">Terjual (30hr)</th>
                  <th className="p-4 text-center">Sisa Stok</th>
                  <th className="p-4 text-right">Saran Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {BOTTOM_PRODUCTS.map((prod, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-700 text-sm">{prod.name}</td>
                    <td className="p-4 text-center text-sm font-medium">{prod.sales}</td>
                    <td className="p-4 text-center text-sm font-medium">{prod.stock}</td>
                    <td className="p-4 text-right">
                      <span className="bg-amber-50 text-amber-600 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tight">Promosikan</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
              <Package size={20} />
            </div>
            <h3 className="font-black text-lg text-slate-800">Efisiensi Stok Inventaris</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">Perputaran Stok (Inventory Turnover)</p>
                <p className="text-xs text-slate-400">Rasio seberapa cepat stok terjual</p>
              </div>
              <p className="text-xl font-black text-emerald-600">4.2x</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total SKU</p>
                <p className="text-lg font-black text-slate-900">{INITIAL_PRODUCTS.length}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Valuasi Stok</p>
                <p className="text-lg font-black text-slate-900">Rp 42.5jt</p>
              </div>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-4">
              <Calendar className="text-indigo-600 shrink-0" size={24} />
              <p className="text-xs text-indigo-700 font-medium">
                Siklus pengadaan barang rata-rata Anda adalah <span className="font-black">12 hari</span>. Ini sudah cukup optimal untuk kategori resto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
