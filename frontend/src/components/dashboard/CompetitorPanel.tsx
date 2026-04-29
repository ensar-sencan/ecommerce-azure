'use client';

import { useEffect, useState } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface CompetitorData {
  categoryStats: { category: string; avgCategoryPrice: number; sellerCount: number }[];
  myPriceRanking: { id: number; name: string; price: number; priceRank: number; totalInCategory: number }[];
  marketShare: { category: string; myRevenue: number; totalRevenue: number; marketSharePercent: number }[];
}

export default function CompetitorPanel() {
  const { user } = useAuthStore();
  const [data, setData] = useState<CompetitorData | null>(null);
  const [loading, setLoading] = useState(true);

  const plan = user?.plan ?? 'free';

  useEffect(() => {
    if (plan === 'free') { setLoading(false); return; }
    api.get(`/api/analytics/competitors?plan=${plan}`)
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, [plan]);

  if (plan === 'free') {
    return (
      <div className="card text-center py-16">
        <p className="text-2xl mb-2">🔒</p>
        <h3 className="font-semibold text-lg mb-2">Standart Plan Gerekli</h3>
        <p className="text-gray-500 mb-6">Rakip analizi için Standart veya Premium plana geçin.</p>
        <button className="btn-primary">Planı Yükselt</button>
      </div>
    );
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-8">
      {/* Price Rankings */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-6">Kategori İçi Fiyat Sıralamam</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-3 font-medium text-gray-500">Ürün</th>
                <th className="text-right pb-3 font-medium text-gray-500">Fiyatım</th>
                <th className="text-right pb-3 font-medium text-gray-500">Sıralama</th>
                <th className="text-right pb-3 font-medium text-gray-500">Durum</th>
              </tr>
            </thead>
            <tbody>
              {data?.myPriceRanking.map(p => {
                const ratio = p.priceRank / p.totalInCategory;
                const label = ratio <= 0.33 ? { text: 'Ucuz', color: 'text-green-600 bg-green-50' }
                            : ratio <= 0.66 ? { text: 'Orta',  color: 'text-yellow-600 bg-yellow-50' }
                            :                 { text: 'Pahalı', color: 'text-red-600 bg-red-50' };
                return (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3 text-right">₺{Number(p.price).toLocaleString('tr-TR')}</td>
                    <td className="py-3 text-right">{p.priceRank}/{p.totalInCategory}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${label.color}`}>{label.text}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Share */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Pazar Payım</h3>
        <div className="space-y-4">
          {data?.marketShare.map(m => (
            <div key={m.category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{m.category}</span>
                <span className="text-gray-500">%{Number(m.marketSharePercent).toFixed(1)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.min(m.marketSharePercent, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
