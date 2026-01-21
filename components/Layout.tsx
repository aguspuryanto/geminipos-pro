
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
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
  const [isSidebarOpen, setSidebarOpen] = useState(false);
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

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50 flex flex-col h-full bg-white border-r border-slate-200 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0 md:w-20 lg:w-64'}
      `}>
        <div className="flex items-center justify-between p-4 h-16 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-indigo-200 shadow-lg">
              <Store size={24} />
            </div>
            {(isSidebarOpen || true) && <span className="font-black text-xl tracking-tight block md:hidden lg:block">GeminiPOS</span>}
          </div>
          <button onClick={closeSidebar} className="md:hidden p-2 text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={`
                flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200
                ${location.pathname === item.path 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 font-bold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <div className="shrink-0">
                {item.icon}
              </div>
              <span className={`transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'md:opacity-0 lg:opacity-100'} block md:hidden lg:block whitespace-nowrap`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 shrink-0">
          <button className="flex items-center gap-3 w-full p-3.5 text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors font-bold">
            <LogOut size={20} />
            <span className={`block md:hidden lg:block ${isSidebarOpen ? 'opacity-100' : 'md:opacity-0 lg:opacity-100'}`}>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 bg-slate-50 rounded-xl text-slate-600 border border-slate-200" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg md:text-xl font-black text-slate-800 truncate max-w-[150px] sm:max-w-none">
              {menuItems.find(i => i.path === location.pathname)?.name || 'Halaman'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-900 leading-tight">Admin Utama</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">OWNER</p>
            </div>
            <div className="relative">
               <img 
                src="https://picsum.photos/seed/admin/100" 
                className="w-9 h-9 md:w-10 md:h-10 rounded-xl border-2 border-white shadow-sm ring-1 ring-slate-200" 
                alt="Profile"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;
