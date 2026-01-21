
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import POS from './views/POS';
import Members from './views/Members';
import Inventory from './views/Inventory';
import CashFlow from './views/CashFlow';

// Placeholder views for basic structure
const Payables = () => <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm"><h2 className="text-2xl font-bold mb-4">Piutang Supplier</h2><p className="text-slate-500">Kelola kewajiban pembayaran kepada supplier dan jatuh tempo piutang.</p></div>;
const Reports = () => <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm"><h2 className="text-2xl font-bold mb-4">Laporan Keuangan</h2><p className="text-slate-500">Laporan laba rugi, penjualan harian, mingguan, dan bulanan.</p></div>;
const Settings = () => <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm"><h2 className="text-2xl font-bold mb-4">Pengaturan Toko</h2><p className="text-slate-500">Konfigurasi printer, pajak, profil toko, dan manajemen user.</p></div>;

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/members" element={<Members />} />
          <Route path="/cashflow" element={<CashFlow />} />
          <Route path="/payables" element={<Payables />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
