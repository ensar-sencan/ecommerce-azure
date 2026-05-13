'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import SellerDashboard from '@/components/dashboard/SellerDashboard';
import CompetitorPanel from '@/components/dashboard/CompetitorPanel';
import CompetitorDashboard from '@/components/dashboard/CompetitorDashboard';
import AICoach from '@/components/dashboard/AICoach';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { BarChart2, Users, Zap } from 'lucide-react';

const tabs = [
  { id: 'stats',      label: 'Performansım',    icon: BarChart2 },
  { id: 'competitor', label: 'Rakip Analizi',   icon: Users },
  { id: 'ai',         label: 'AI Öneriler',     icon: Zap },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('stats');

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Satıcı Paneli</h1>
          <p className="text-gray-500 mt-1">Satış performansınızı ve rakip verilerinizi takip edin.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-xl w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {activeTab === 'stats'      && <SellerDashboard />}
        {activeTab === 'competitor' && <CompetitorDashboard />}
        {activeTab === 'ai'         && <AICoach />}
      </main>
    </>
  );
}
