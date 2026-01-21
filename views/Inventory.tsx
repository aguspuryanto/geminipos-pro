
import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  History, 
  Layers, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  PlusCircle,
  MinusCircle,
  // Fix: Import missing Calendar icon
  Calendar
} from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../constants';
import { Product, Category } from '../types';

type TabType = 'PRODUCTS' | 'CATEGORIES' | 'HISTORY';

const DUMMY_HISTORY = [
  { id: 'h1', date: '2023-10-25 14:30', product: 'Nasi Goreng Spesial', type: 'IN', qty: 20, reason: 'Produksi Dapur' },
  { id: 'h2', date: '2023-10-25 12:15', product: 'Es Teh Manis', type: 'OUT', qty: 5, reason: 'Penjualan POS' },
  { id: 'h3', date: '2023-10-24 09:00', product: 'Kopi Susu Gula Aren', type: 'IN', qty: 50, reason: 'Restok Supplier' },
  { id: 'h4', date: '2023-10-24 18:45', product: 'Chiki Balls', type: 'OUT', qty: 2, reason: 'Barang Rusak' },
];

const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('PRODUCTS');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const renderProducts = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari SKU atau nama produk..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 p-3 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white p-3 px-6 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
            <Plus size={18} />
            Produk Baru
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-50/50">
              <tr className="text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="p-6">Produk</th>
                <th className="p-6">Kategori</th>
                <th className="p-6">Harga Jual</th>
                <th className="p-6">Stok</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => {
                const isLowStock = product.stock <= product.minStock;
                const categoryName = categories.find(c => c.id === product.categoryId)?.name || 'Tanpa Kategori';
                
                return (
                  <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm bg-slate-100 shrink-0 border border-slate-200">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 text-sm truncate">{product.name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {categoryName}
                      </span>
                    </td>
                    <td className="p-6">
                      <p className="font-black text-slate-900 text-sm">Rp {product.price.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-slate-400">Modal: Rp {product.costPrice.toLocaleString()}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <p className={`font-black text-sm ${isLowStock ? 'text-rose-500' : 'text-slate-800'}`}>
                          {product.stock} <span className="text-[10px] font-bold text-slate-400">Pcs</span>
                        </p>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${isLowStock ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      {isLowStock ? (
                        <div className="flex items-center gap-1.5 text-rose-500 bg-rose-50 px-3 py-1 rounded-full w-fit">
                          <AlertCircle size={12} />
                          <span className="text-[10px] font-black uppercase tracking-tight">Stok Rendah</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">
                          <CheckCircle2 size={12} />
                          <span className="text-[10px] font-black uppercase tracking-tight">Tersedia</span>
                        </div>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Edit">
                           <Edit3 size={18} />
                         </button>
                         <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Hapus">
                           <Trash2 size={18} />
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-800">Kategori Produk</h3>
          <p className="text-sm font-medium text-slate-500">Kelola pengelompokan produk Anda</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white p-3 px-6 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
          <Plus size={18} />
          Kategori Baru
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:shadow-md hover:border-indigo-200 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <Layers size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-800">{cat.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">12 Produk Terdaftar</p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit3 size={18} /></button>
               <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
       <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-800">Riwayat Mutasi Stok</h3>
          <p className="text-sm font-medium text-slate-500">Laporan keluar masuk barang secara real-time</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-600 p-3 px-6 rounded-2xl font-bold hover:bg-slate-50 transition-all">
          Unduh Laporan
        </button>
      </div>
      
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
               <tr className="text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="p-6">Waktu</th>
                <th className="p-6">Produk</th>
                <th className="p-6 text-center">Tipe</th>
                <th className="p-6 text-center">Jumlah</th>
                <th className="p-6">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DUMMY_HISTORY.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      {/* Fix: Calendar component now works as it's correctly imported from lucide-react */}
                      <Calendar size={16} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-600">{log.date}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-sm font-black text-slate-800">{log.product}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center">
                      {log.type === 'IN' ? (
                        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                          <TrendingUp size={14} />
                          <span className="text-[10px] font-black">STOK MASUK</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
                          <TrendingDown size={14} />
                          <span className="text-[10px] font-black">STOK KELUAR</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`text-sm font-black ${log.type === 'IN' ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {log.type === 'IN' ? '+' : '-'}{log.qty}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className="text-sm font-medium text-slate-500 italic">{log.reason}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'PRODUCTS', label: 'Stok Produk', icon: <Package size={18} /> },
    { id: 'CATEGORIES', label: 'Kategori', icon: <Layers size={18} /> },
    { id: 'HISTORY', label: 'Riwayat Mutasi', icon: <History size={18} /> },
  ];

  return (
    <div className="space-y-8">
      {/* Tabs Navigation */}
      <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] w-full sm:w-fit shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`
              flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest
              ${activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-100 ring-1 ring-slate-200' 
                : 'text-slate-500 hover:text-slate-800'}
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="min-h-[60vh]">
        {activeTab === 'PRODUCTS' && renderProducts()}
        {activeTab === 'CATEGORIES' && renderCategories()}
        {activeTab === 'HISTORY' && renderHistory()}
      </div>
    </div>
  );
};

// Internal utility component for the Inventory table
const CheckCircle2 = ({ size }: { size: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default Inventory;
