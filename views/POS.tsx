
import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, Search, User, CreditCard, Receipt, 
  Trash2, Plus, Minus, CheckCircle2, LayoutGrid, 
  List, X, Sparkles, Wallet, ChevronUp 
} from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_MEMBERS } from '../constants';
import { Product, CartItem, Member, POSMode } from '../types';

const POS: React.FC = () => {
  const [mode, setMode] = useState<POSMode>(POSMode.RETAIL);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountTotal = cart.reduce((acc, item) => acc + ((item.price * item.discount / 100) * item.quantity), 0);
  const tax = subtotal * 0.11;
  const grandTotal = subtotal - discountTotal + tax;

  const showTebusMurah = grandTotal >= 50000;

  const CartContent = () => (
    <div className="flex flex-col h-full bg-white lg:rounded-3xl lg:shadow-xl lg:border lg:border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart size={20} className="text-indigo-600" />
          <h3 className="font-black text-slate-800">Keranjang ({cart.length})</h3>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => setCart([])} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
            <Trash2 size={20} />
          </button>
          <button onClick={() => setIsMobileCartOpen(false)} className="lg:hidden p-2 text-slate-400">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-3 py-10 opacity-60">
            <div className="bg-slate-50 p-6 rounded-full">
              <ShoppingCart size={48} strokeWidth={1.5} />
            </div>
            <p className="font-bold">Belum ada pesanan</p>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.id} className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                <img src={item.image} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-slate-800 text-sm truncate leading-tight mb-1">{item.name}</h5>
                <p className="text-xs text-indigo-600 font-black">Rp {item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:bg-white rounded-lg transition-colors shadow-sm"><Minus size={14} /></button>
                <span className="text-sm font-black w-8 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:bg-white rounded-lg transition-colors shadow-sm"><Plus size={14} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        {selectedMember ? (
          <div className="bg-indigo-600 rounded-2xl p-3.5 text-white flex items-center justify-between shadow-indigo-100 shadow-lg">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Member Terhubung</p>
              <p className="font-black text-sm">{selectedMember.name}</p>
            </div>
            <button onClick={() => setSelectedMember(null)} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
              <X size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setSelectedMember(INITIAL_MEMBERS[0])}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 p-3.5 rounded-2xl text-slate-500 hover:bg-white hover:border-indigo-400 hover:text-indigo-600 transition-all font-bold text-sm"
          >
            <User size={18} />
            Hubungkan Member
          </button>
        )}
      </div>

      <div className="p-5 space-y-3 bg-white border-t border-slate-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between text-xs font-bold text-slate-400">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString()}</span>
        </div>
        {discountTotal > 0 && (
          <div className="flex justify-between text-xs font-bold text-rose-500">
            <span>Diskon Item</span>
            <span>-Rp {discountTotal.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-xs font-bold text-slate-400">
          <span>Pajak (11%)</span>
          <span>Rp {tax.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between text-xl font-black text-slate-900 pt-3 border-t border-slate-50">
          <span>Total</span>
          <span>Rp {grandTotal.toLocaleString()}</span>
        </div>

        <button 
          disabled={cart.length === 0}
          onClick={() => setIsCheckingOut(true)}
          className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <CreditCard size={20} />
          BAYAR SEKARANG
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full pb-20 lg:pb-0 relative">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari produk..."
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-white p-1.5 border border-slate-200 rounded-2xl shadow-sm overflow-hidden shrink-0">
            <button 
              onClick={() => setMode(POSMode.RETAIL)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition-all font-bold text-xs flex items-center justify-center gap-2 ${mode === POSMode.RETAIL ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={16} />
              Retail
            </button>
            <button 
              onClick={() => setMode(POSMode.RESTO)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition-all font-bold text-xs flex items-center justify-center gap-2 ${mode === POSMode.RESTO ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={16} />
              Resto
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 pb-24 custom-scrollbar">
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white border border-slate-200 rounded-[2rem] p-3 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer group flex flex-col h-fit active:scale-95"
            >
              <div className="relative mb-3 overflow-hidden rounded-[1.5rem] aspect-square bg-slate-50 border border-slate-100">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {product.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                    -{product.discount}%
                  </div>
                )}
                <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors flex items-center justify-center">
                   <Plus className="text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all" size={32} />
                </div>
              </div>
              <div className="px-1">
                <h4 className="font-bold text-slate-800 line-clamp-2 text-sm h-10 mb-1 leading-tight">{product.name}</h4>
                <div className="flex items-center justify-between">
                  <p className="text-indigo-600 font-black text-base">Rp {product.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                   <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{width: `${Math.min(100, (product.stock/100)*100)}%`}} />
                   </div>
                   <span className="text-[10px] font-black text-slate-400 whitespace-nowrap">{product.stock} Stok</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Cart Sidebar */}
      <div className="hidden lg:block w-[380px] h-full shrink-0">
        <CartContent />
      </div>

      {/* Mobile Floating Cart Summary */}
      {!isMobileCartOpen && cart.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4 lg:hidden z-40 animate-in slide-in-from-bottom-10 duration-500">
          <button 
            onClick={() => setIsMobileCartOpen(true)}
            className="w-full bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-2xl ring-4 ring-white shadow-slate-200 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl relative">
                <ShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900">
                  {cart.length}
                </span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Belanja</p>
                <p className="font-black text-lg leading-none">Rp {grandTotal.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-indigo-400 font-black text-sm">
               LIHAT KERANJANG
               <ChevronUp size={20} />
            </div>
          </button>
        </div>
      )}

      {/* Mobile Cart Drawer/Modal */}
      {isMobileCartOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileCartOpen(false)} />
           <div className="absolute bottom-0 left-0 right-0 h-[85vh] animate-in slide-in-from-bottom-full duration-500 bg-white rounded-t-[2.5rem] overflow-hidden">
              <CartContent />
           </div>
        </div>
      )}

      {/* Checkout Modal Simulation (Responsive) */}
      {isCheckingOut && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-t-[3rem] sm:rounded-[3rem] w-full max-w-lg p-8 sm:p-10 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
            <div className="text-center space-y-4 mb-8">
              <div className="bg-emerald-100 text-emerald-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={44} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Pilih Pembayaran</h2>
              <p className="text-slate-500 font-medium">Tagihan Total: <span className="text-indigo-600 font-black text-2xl">Rp {grandTotal.toLocaleString()}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {[
                { icon: <Wallet size={24} />, label: 'Tunai', color: 'indigo' },
                { icon: <CreditCard size={24} />, label: 'Debit', color: 'blue' },
                { icon: <div className="font-black text-lg">QRIS</div>, label: 'E-Wallet', color: 'emerald' },
                { icon: <User size={24} />, label: 'Poin', color: 'amber' }
              ].map((method) => (
                <button 
                  key={method.label}
                  className="flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 border-slate-50 bg-slate-50 hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all gap-3 group active:scale-95"
                >
                  <div className={`text-slate-400 group-hover:text-indigo-600 transition-colors`}>{method.icon}</div>
                  <span className="font-black text-sm uppercase tracking-widest">{method.label}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setIsCheckingOut(false)}
                className="order-2 sm:order-1 flex-1 bg-slate-100 text-slate-500 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all text-sm uppercase tracking-widest"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  setCart([]);
                  setIsCheckingOut(false);
                  setIsMobileCartOpen(false);
                  alert('Transaksi Berhasil! Mencetak Struk...');
                }}
                className="order-1 sm:order-2 flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 text-sm uppercase tracking-widest active:scale-[0.98]"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
