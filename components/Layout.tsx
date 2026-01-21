
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  Settings, 
  FileText,
  LogOut,
  Menu,
  X,
  Store,
  Wallet,
  Calculator
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Kasir (POS)', icon: <ShoppingCart size={20} />, path: '/pos' },
    { name: 'Produk & Stok', icon: <Package size={20} />, path: '/inventory' },
    { name: 'Member', icon: <Users size={20} />, path: '/members' },
    { name: 'Alur Kas', icon: <Wallet size={20} />, path: '/cashflow' },
    { name: 'Piutang Supplier', icon: <Calculator size={20} />, path: '/payables' },
    { name: 'Laporan', icon: <FileText size={20} />, path: '/reports' },
    { name: 'Pengaturan', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Backdrop */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-30 flex flex-col h-full bg-white border-r border-slate-200 transition-all duration-300
        ${isSidebarOpen ? 'w-64' : 'w-20'}
      `}>
        <div className="flex items-center justify-between p-4 h-16 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Store size={24} />
            </div>
            {isSidebarOpen && <span className="font-bold text-lg tracking-tight">GeminiPOS</span>}
          </div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                ${location.pathname === item.path 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <div className={location.pathname === item.path ? 'text-indigo-600' : ''}>
                {item.icon}
              </div>
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-800">
              {menuItems.find(i => i.path === location.pathname)?.name || 'Halaman'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">Admin Utama</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Pemilik Toko</p>
            </div>
            <img 
              src="https://picsum.photos/seed/admin/40" 
              className="w-10 h-10 rounded-full border border-slate-200" 
              alt="Profile"
            />
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;
