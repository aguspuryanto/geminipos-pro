
import React, { useState, useMemo } from 'react';
import { ShoppingCart, Search, User, CreditCard, Receipt, Trash2, Plus, Minus, CheckCircle2, LayoutGrid, List, X, Sparkles, Wallet } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_MEMBERS } from '../constants';
import { Product, CartItem, Member, POSMode } from '../types';

const POS: React.FC = () => {
  const [mode, setMode] = useState<POSMode>(POSMode.RETAIL);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

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

  // Promotion "Tebus Murah" logic
  const showTebusMurah = grandTotal >= 50000;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Product Selection */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari produk atau scan barcode..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-white p-1 border border-slate-200 rounded-xl">
            <button 
              onClick={() => setMode(POSMode.RETAIL)}
              className={`p-2 rounded-lg transition-colors ${mode === POSMode.RETAIL ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setMode(POSMode.RESTO)}
              className={`p-2 rounded-lg transition-colors ${mode === POSMode.RESTO ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col h-fit"
            >
              <div className="relative mb-3 overflow-hidden rounded-xl aspect-square bg-slate-100">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                {product.discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-slate-800 line-clamp-2 text-sm h-10 mb-1">{product.name}</h4>
              <p className="text-indigo-600 font-bold">Rp {product.price.toLocaleString()}</p>
              <p className="text-[10px] text-slate-400 mt-1">Stok: {product.stock}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Side Area */}
      <div className="w-full lg:w-[400px] flex flex-col h-full bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden shrink-0">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-indigo-600" />
            <h3 className="font-bold">Pesanan Baru</h3>
          </div>
          <button onClick={() => setCart([])} className="text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 opacity-50">
              <ShoppingCart size={48} strokeWidth={1} />
              <p>Keranjang masih kosong</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 animate-in slide-in-from-right-2">
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                  <img src={item.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-slate-800 text-sm truncate">{item.name}</h5>
                  <p className="text-xs text-indigo-600 font-bold">Rp {item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded transition-colors"><Minus size={14} /></button>
                  <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded transition-colors"><Plus size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Member Section */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          {selectedMember ? (
            <div className="bg-indigo-600 rounded-xl p-3 text-white flex items-center justify-between shadow-md">
              <div>
                <p className="text-[10px] opacity-70 font-bold uppercase tracking-wider">Pelanggan Setia</p>
                <p className="font-bold text-sm">{selectedMember.name}</p>
                <p className="text-[10px] bg-white/20 inline-block px-2 py-0.5 rounded-full mt-1">Poin: {selectedMember.points}</p>
              </div>
              {/* Fix: Added missing X icon import */}
              <button onClick={() => setSelectedMember(null)} className="p-1 hover:bg-white/10 rounded-full">
                <X size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setSelectedMember(INITIAL_MEMBERS[0])}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 p-3 rounded-xl text-slate-500 hover:bg-white hover:border-indigo-400 hover:text-indigo-600 transition-all"
            >
              <User size={18} />
              <span className="text-sm font-semibold">Hubungkan Member</span>
            </button>
          )}
        </div>

        {/* Totals & Checkout */}
        <div className="p-6 space-y-3 bg-white border-t border-slate-100">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString()}</span>
          </div>
          {discountTotal > 0 && (
            <div className="flex justify-between text-sm text-red-500">
              <span>Diskon</span>
              <span>-Rp {discountTotal.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-slate-500">
            <span>Pajak (11%)</span>
            <span>Rp {tax.toLocaleString()}</span>
          </div>
          
          {showTebusMurah && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3 animate-bounce">
              {/* Fix: Added missing Sparkles icon import */}
              <Sparkles className="text-amber-600 shrink-0" size={20} />
              <div>
                <p className="text-xs font-bold text-amber-900">Promo Tebus Murah!</p>
                <p className="text-[10px] text-amber-700">Belanja >50k, tebus Chiki hanya Rp 2.000</p>
                <button className="mt-2 bg-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-lg">Tambahkan</button>
              </div>
            </div>
          )}

          <div className="flex justify-between text-xl font-black text-slate-900 pt-2 border-t border-slate-50">
            <span>Total</span>
            <span>Rp {grandTotal.toLocaleString()}</span>
          </div>

          <button 
            disabled={cart.length === 0}
            onClick={() => setIsCheckingOut(true)}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 mt-4"
          >
            <CreditCard size={20} />
            Bayar Sekarang
          </button>
        </div>
      </div>

      {/* Checkout Modal Simulation */}
      {isCheckingOut && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 animate-in zoom-in-95">
            <div className="text-center space-y-4 mb-8">
              <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black">Pilih Metode Bayar</h2>
              <p className="text-slate-500">Total Tagihan: <span className="text-slate-900 font-bold">Rp {grandTotal.toLocaleString()}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all gap-2 group">
                {/* Fix: Added missing Wallet icon import */}
                <Wallet className="text-slate-400 group-hover:text-indigo-600" />
                <span className="font-bold text-sm">Tunai</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all gap-2 group">
                <CreditCard className="text-slate-400 group-hover:text-indigo-600" />
                <span className="font-bold text-sm">Debit/Kredit</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all gap-2 group">
                <div className="font-black text-slate-400 group-hover:text-indigo-600">QRIS</div>
                <span className="font-bold text-sm">E-Wallet</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all gap-2 group">
                <User className="text-slate-400 group-hover:text-indigo-600" />
                <span className="font-bold text-sm">Poin Member</span>
              </button>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsCheckingOut(false)}
                className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  setCart([]);
                  setIsCheckingOut(false);
                  alert('Transaksi Berhasil! Mencetak Struk...');
                }}
                className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
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
