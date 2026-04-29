'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import api from '@/lib/api';
import { TrendingUp, Eye, ShoppingBag, DollarSign } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

interface Stats {
  overview: { totalSales: number; totalRevenue: number; totalViews: number };
  topProducts: { name: string; sales: number; revenue: number; views: number }[];
  conversionRates: { name: string; views: number; sales: number; conversionRate: number }[];
}

export default function SellerDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/analytics/stats')
      .then(r => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;
  if (!stats) return <p className="text-red-500">Veriler yüklenemedi.</p>;

  const { overview, topProducts, conversionRates } = stats;

  return (
    <div className="space-y-8">
      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Toplam Satış', value: overview.totalSales?.toLocaleString() ?? 0, icon: ShoppingBag, color: 'text-blue-600' },
          { label: 'Toplam Gelir', value: `₺${Number(overview.totalRevenue ?? 0).toLocaleString('tr-TR')}`, icon: DollarSign, color: 'text-green-600' },
          { label: 'Toplam Görüntülenme', value: overview.totalViews?.toLocaleString() ?? 0, icon: Eye, color: 'text-purple-600' },
          { label: 'Ort. Dönüşüm', value: overview.totalViews > 0 ? `%${((overview.totalSales / overview.totalViews) * 100).toFixed(1)}` : '%0', icon: TrendingUp, color: 'text-orange-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{label}</p>
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Top Products Chart */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-6">En Çok Satan Ürünler</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={topProducts}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip formatter={(v: number) => [`₺${v.toLocaleString()}`, 'Gelir']} />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Rates */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-6">Ürün Dönüşüm Oranları (%)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={conversionRates} layout="vertical">
            <XAxis type="number" unit="%" />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={120} />
            <Tooltip formatter={(v: number) => [`%${v.toFixed(2)}`, 'Dönüşüm']} />
            <Bar dataKey="conversionRate" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
