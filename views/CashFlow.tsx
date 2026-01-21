
import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  MoreVertical, 
  Trash2, 
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ChevronRight,
  PlusCircle,
  X
} from 'lucide-react';
import { CashFlow } from '../types';

const DUMMY_CASHFLOW: CashFlow[] = [
  { id: 'cf1', date: '2023-10-25', type: 'OUT', amount: 500000, description: 'Pembayaran Listrik Bulanan', category: 'Operasional' },
  { id: 'cf2', date: '2023-10-25', type: 'IN', amount: 2000000, description: 'Setoran Modal Awal Hari', category: 'Modal' },
  { id: 'cf3', date: '2023-10-24', type: 'OUT', amount: 150000, description: 'Beli Galon & Kebersihan', category: 'Kebutuhan Kantor' },
  { id: 'cf4', date: '2023-10-23', type: 'OUT', amount: 3000000, description: 'Sewa Ruko Tahap 2', category: 'Sewa' },
];

const CATEGORIES = ['Operasional', 'Modal', 'Sewa', 'Gaji', 'Kebutuhan Kantor', 'Lainnya'];

const CashFlowView: React.FC = () => {
  const [records, setRecords] = useState<CashFlow[]>(DUMMY_CASHFLOW);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');

  const totals = useMemo(() => {
    return records.reduce((acc, curr) => {
      if (curr.type === 'IN') acc.in += curr.amount;
      else acc.out += curr.amount;
      return acc;
    }, { in: 0, out: 0 });
  }, [records]);

  const balance = totals.in - totals.out;

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = r.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           r.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'ALL' || r.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [records, searchTerm, filterType]);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <TrendingUp size={80} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600 shadow-inner">
              <ArrowUpCircle size={24} />
            </div>
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Uang Masuk</h3>
          </div>
          <p className="text-2xl font-black text-slate-800">Rp {totals.in.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <TrendingDown size={80} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-rose-100 p-3 rounded-2xl text-rose-600 shadow-inner">
              <ArrowDownCircle size={24} />
            </div>
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Uang Keluar</h3>
          </div>
          <p className="text-2xl font-black text-slate-800">Rp {totals.out.toLocaleString()}</p>
        </div>

        <div className={`p-6 rounded-[2rem] border shadow-lg relative overflow-hidden group transition-all ${balance >= 0 ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-rose-600 border-rose-500 text-white'}`}>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
            <Wallet size={80} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <DollarSign size={24} />
            </div>
            <h3 className="text-white/70 text-xs font-black uppercase tracking-widest">Saldo Bersih (Alur Kas)</h3>
          </div>
          <p className="text-2xl font-black">Rp {balance.toLocaleString()}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari deskripsi atau kategori..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
              {(['ALL', 'IN', 'OUT'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                    filterType === type ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {type === 'ALL' ? 'Semua' : type === 'IN' ? 'Masuk' : 'Keluar'}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white p-4 px-8 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <PlusCircle size={20} />
            Catat Alur Kas
          </button>
        </div>

        <div className="overflow-x-auto -mx-6 md:mx-0">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-50/50">
              <tr className="text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="p-6">Tanggal & Waktu</th>
                <th className="p-6">Deskripsi</th>
                <th className="p-6">Kategori</th>
                <th className="p-6 text-right">Jumlah (Rp)</th>
                <th className="p-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-400 font-medium">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-600">{record.date}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${record.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {record.type === 'IN' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                        </div>
                        <span className="text-sm font-black text-slate-800">{record.description}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                        {record.category}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <span className={`text-sm font-black ${record.type === 'IN' ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {record.type === 'IN' ? '+' : '-'} {record.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-t-[3rem] sm:rounded-[3rem] w-full max-w-lg p-8 sm:p-10 shadow-2xl animate-in slide-in-from-bottom-10 duration-500 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Catat Alur Kas</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tipe Transaksi</label>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" className="p-4 rounded-2xl border-2 border-indigo-600 bg-indigo-50 text-indigo-700 font-black flex items-center justify-center gap-2">
                    <ArrowUpCircle size={20} />
                    Uang Masuk
                  </button>
                  <button type="button" className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-500 font-black flex items-center justify-center gap-2 hover:border-rose-200">
                    <ArrowDownCircle size={20} />
                    Uang Keluar
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Deskripsi</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Pembayaran Token Listrik"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Jumlah (Rp)</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-black text-indigo-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Kategori</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium appearance-none">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tanggal</label>
                <input 
                  type="date" 
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium"
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="order-2 sm:order-1 flex-1 bg-slate-100 text-slate-500 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all text-sm uppercase tracking-widest"
                >
                  Batal
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="order-1 sm:order-2 flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 text-sm uppercase tracking-widest active:scale-[0.98]"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashFlowView;
