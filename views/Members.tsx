
import React, { useState } from 'react';
import { UserPlus, Search, Gift, Smartphone, Calendar, QrCode, Download, CreditCard } from 'lucide-react';
import { INITIAL_MEMBERS } from '../constants';
import { Member } from '../types';

const Members: React.FC = () => {
  const [members] = useState<Member[]>(INITIAL_MEMBERS);
  const [showCardModal, setShowCardModal] = useState<Member | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama atau nomor HP member..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>
        <button className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all">
          <UserPlus size={20} />
          Member Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => (
          <div key={member.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Smartphone size={32} />
                </div>
                <div className="bg-emerald-50 text-emerald-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Aktif
                </div>
              </div>
              
              <div className="space-y-1 mb-6">
                <h4 className="text-xl font-bold text-slate-900">{member.name}</h4>
                <p className="text-slate-500 font-medium">{member.phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-[10px] uppercase text-slate-400 font-black mb-1">Total Poin</p>
                  <p className="text-lg font-black text-indigo-600">{member.points.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-[10px] uppercase text-slate-400 font-black mb-1">Bergabung</p>
                  <p className="text-sm font-bold text-slate-700">{member.joinDate}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setShowCardModal(member)}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <CreditCard size={16} />
                  Lihat Kartu
                </button>
                <button className="flex-1 bg-indigo-50 text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 text-sm">
                  <Gift size={16} />
                  Redeem
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Member Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8">
            <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 p-8 text-white relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <QrCode size={180} />
              </div>
              <div className="relative z-10 flex flex-col h-64">
                <div className="flex justify-between items-start mb-auto">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-xl text-indigo-600">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-black tracking-widest uppercase opacity-70 leading-none">GeminiPOS</p>
                      <p className="text-lg font-black">LOYALTY CARD</p>
                    </div>
                  </div>
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                    <QrCode size={40} />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Card Holder</p>
                  <p className="text-2xl font-black tracking-tight uppercase">{showCardModal.name}</p>
                </div>

                <div className="mt-8 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">ID Member</p>
                    <p className="font-mono text-lg tracking-widest">MEM-ID-{showCardModal.id.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Member Since</p>
                    <p className="font-bold">{showCardModal.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between text-slate-400 text-sm">
                <span>Scan QR Code ini pada kasir saat transaksi</span>
                <span>v1.0.4</span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowCardModal(null)}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Tutup
                </button>
                <button className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  <Download size={20} />
                  Download PNG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
