'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Target, Award, AlertCircle, Users } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface CompetitorData {
  categoryStats: { category: string; avgCategoryPrice: number; maxPrice: number; minPrice: number; sellerCount: number }[];
  myPriceRanking: { id: number; name: string; price: number; priceRank: number; totalInCategory: number }[];
  reviewComparison: { categoryId: number; categoryAvgRating: number; avgReviewsPerProduct: number }[];
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
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [plan]);

  if (plan === 'free') {
    return (
      <div className="card text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-6">
          <Users size={40} className="text-white" />
        </div>
        <h3 className="font-semibold text-2xl mb-3">Rakip Analizi</h3>
        <p className="text-gray-500 mb-2 max-w-md mx-auto">
          Rakiplerinizle karşılaştırmalı analiz yapın
        </p>
        <p className="text-sm text-gray-400 mb-8">
          • Fiyat karşılaştırması<br/>
          • Pazar payı analizi<br/>
          • Kategori performansı<br/>
          • Rekabet avantajları
        </p>
        <button className="btn-primary">Standart Plan'a Geç</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4" />
        <p className="text-gray-500">Rakip verileri analiz ediliyor...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card text-center py-16">
        <p className="text-gray-500">Rakip verileri yüklenemedi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Toplam Rakip</p>
              <p className="text-3xl font-bold">
                {data.categoryStats.reduce((sum, cat) => sum + cat.sellerCount, 0)}
              </p>
            </div>
            <Users size={40} className="text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Aktif Kategori</p>
              <p className="text-3xl font-bold">{data.categoryStats.length}</p>
            </div>
            <Target size={40} className="text-purple-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Ortalama Pazar Payı</p>
              <p className="text-3xl font-bold">
                %{(data.marketShare.reduce((sum, m) => sum + m.marketSharePercent, 0) / data.marketShare.length || 0).toFixed(1)}
              </p>
            </div>
            <Award size={40} className="text-green-200" />
          </div>
        </div>
      </div>

      {/* Category Stats */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Target className="text-blue-600" size={20} />
          Kategori Bazlı Rekabet Analizi
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left pb-3 font-semibold text-gray-700">Kategori</th>
                <th className="text-right pb-3 font-semibold text-gray-700">Rakip Sayısı</th>
                <th className="text-right pb-3 font-semibold text-gray-700">Ort. Fiyat</th>
                <th className="text-right pb-3 font-semibold text-gray-700">Min-Max</th>
                <th className="text-right pb-3 font-semibold text-gray-700">Rekabet</th>
              </tr>
            </thead>
            <tbody>
              {data.categoryStats.map((cat, idx) => {
                const competition = cat.sellerCount > 10 ? 'Yüksek' : cat.sellerCount > 5 ? 'Orta' : 'Düşük';
                const competitionColor = cat.sellerCount > 10 ? 'text-red-600 bg-red-50' : cat.sellerCount > 5 ? 'text-yellow-600 bg-yellow-50' : 'text-green-600 bg-green-50';
                
                return (
                  <tr key={idx} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 font-medium text-gray-900">{cat.category}</td>
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center gap-1">
                        <Users size={14} className="text-gray-400" />
                        {cat.sellerCount}
                      </span>
                    </td>
                    <td className="py-4 text-right font-semibold">₺{Number(cat.avgCategoryPrice).toLocaleString('tr-TR')}</td>
                    <td className="py-4 text-right text-gray-500 text-xs">
                      ₺{Number(cat.minPrice).toLocaleString('tr-TR')} - ₺{Number(cat.maxPrice).toLocaleString('tr-TR')}
                    </td>
                    <td className="py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${competitionColor}`}>
                        {competition}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price Rankings */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="text-green-600" size={20} />
          Fiyat Konumlandırma Analizi
        </h3>
        <div className="space-y-3">
          {data.myPriceRanking.map(p => {
            const ratio = p.priceRank / p.totalInCategory;
            const position = ratio <= 0.33 ? { 
              label: 'Ekonomik', 
              color: 'text-green-600 bg-green-50 border-green-200',
              icon: TrendingDown,
              advice: 'Fiyat avantajınız var'
            } : ratio <= 0.66 ? { 
              label: 'Dengeli', 
              color: 'text-blue-600 bg-blue-50 border-blue-200',
              icon: Minus,
              advice: 'Orta segment'
            } : { 
              label: 'Premium', 
              color: 'text-purple-600 bg-purple-50 border-purple-200',
              icon: TrendingUp,
              advice: 'Yüksek fiyat segmenti'
            };
            
            const Icon = position.icon;
            
            return (
              <div key={p.id} className={`border-2 ${position.color} rounded-xl p-4`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{p.name}</h4>
                    <p className="text-sm text-gray-500">{position.advice}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon size={20} />
                    <span className="font-bold text-lg">₺{Number(p.price).toLocaleString('tr-TR')}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={`px-3 py-1 rounded-full font-semibold ${position.color}`}>
                    {position.label}
                  </span>
                  <span className="text-gray-600">
                    Sıralama: <span className="font-semibold">{p.priceRank}/{p.totalInCategory}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Share */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Award className="text-yellow-600" size={20} />
          Pazar Payı Dağılımı
        </h3>
        <div className="space-y-5">
          {data.marketShare.map((m, idx) => {
            const percentage = Number(m.marketSharePercent);
            const status = percentage > 20 ? 'Lider' : percentage > 10 ? 'Güçlü' : percentage > 5 ? 'Orta' : 'Gelişmekte';
            const statusColor = percentage > 20 ? 'text-green-600' : percentage > 10 ? 'text-blue-600' : percentage > 5 ? 'text-yellow-600' : 'text-gray-600';
            
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-semibold text-gray-900">{m.category}</span>
                    <span className={`ml-2 text-sm font-medium ${statusColor}`}>• {status}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">%{percentage.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">
                      ₺{Number(m.myRevenue).toLocaleString('tr-TR')} / ₺{Number(m.totalRevenue).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(percentage, 100)}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="card bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Rekabet İçgörüleri</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Toplam {data.categoryStats.reduce((sum, cat) => sum + cat.sellerCount, 0)} rakiple rekabet ediyorsunuz</li>
              <li>• En yüksek rekabet: {data.categoryStats.sort((a, b) => b.sellerCount - a.sellerCount)[0]?.category} kategorisinde</li>
              <li>• Ortalama pazar payınız: %{(data.marketShare.reduce((sum, m) => sum + m.marketSharePercent, 0) / data.marketShare.length || 0).toFixed(1)}</li>
              <li>• Premium plan ile AI destekli detaylı öneriler alabilirsiniz</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
