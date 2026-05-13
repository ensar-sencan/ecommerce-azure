'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Award } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Chart.js kayıt
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CompetitorDashboard() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkModeQuery.matches);

    const handler = (e) => setIsDark(e.matches);
    darkModeQuery.addEventListener('change', handler);
    return () => darkModeQuery.removeEventListener('change', handler);
  }, []);

  // Renkler
  const colors = {
    primary: '#378ADD',
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827'
    }
  };

  const textColor = isDark ? colors.gray[200] : colors.gray[700];
  const gridColor = isDark ? colors.gray[700] : colors.gray[200];

  // Fiyat Dağılımı Chart Data
  const priceDistributionData = {
    labels: ['₺0-100', '₺100-150', '₺150-200', '₺200-250', '₺250+'],
    datasets: [{
      label: 'Satıcı Sayısı',
      data: [4, 8, 12, 9, 5],
      backgroundColor: [
        colors.gray[300],
        colors.gray[300],
        colors.primary,
        colors.gray[300],
        colors.gray[300]
      ],
      borderRadius: 8,
      barThickness: 40
    }]
  };

  const priceDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? colors.gray[800] : 'white',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
        padding: 12,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { size: 11 } }
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, stepSize: 2 }
      }
    }
  };

  // Pazar Payı Chart Data
  const marketShareData = {
    labels: ['Sen', 'Lider', '2. Sıra', '3. Sıra', 'Diğerleri'],
    datasets: [{
      data: [11, 28, 19, 14, 28],
      backgroundColor: [
        colors.primary,
        colors.gray[700],
        colors.gray[500],
        colors.gray[400],
        colors.gray[200]
      ],
      borderWidth: 0
    }]
  };

  const marketShareOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? colors.gray[800] : 'white',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => `${context.label}: %${context.parsed}`
        }
      }
    }
  };

  // Trend Chart Data
  const trendData = {
    labels: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'],
    datasets: [
      {
        label: 'Senin satışın',
        data: [98, 112, 105, 134, 128, 156, 143, 168],
        borderColor: colors.primary,
        backgroundColor: colors.primary + '20',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Kategori ortalaması',
        data: [110, 118, 115, 125, 130, 140, 138, 145],
        borderColor: colors.gray[400],
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? colors.gray[800] : 'white',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor }
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor }
      }
    }
  };

  // Dönüşüm verileri
  const conversionData = [
    { label: 'Sen', value: 2.1, percent: 35, color: colors.primary },
    { label: 'Kategori lideri', value: 5.8, percent: 97, color: colors.gray[700] },
    { label: 'Kategori ortalaması', value: 3.4, percent: 57, color: colors.gray[500] },
    { label: 'Alt %25', value: 1.2, percent: 20, color: colors.gray[300] }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Rakip Analizi
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Elektronik</span>
            <span>›</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">Telefon Aksesuarı</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-full text-sm font-semibold">
            Premium
          </span>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} />
            <span>2 dakika önce</span>
          </div>
        </div>
      </div>

      {/* 4'lü Metrik Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Aylık Satış */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Aylık Satış</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">1.284</p>
          <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
            <TrendingUp size={16} />
            <span>+12% geçen aya göre</span>
          </div>
        </div>

        {/* Kategori Sırası */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Kategori Sırası</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">#4 / 38</p>
          <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
            <TrendingUp size={16} />
            <span>2 sıra yükseldi</span>
          </div>
        </div>

        {/* Dönüşüm Oranı */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Dönüşüm Oranı</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">2.1%</p>
          <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
            <TrendingDown size={16} />
            <span>Kategori ort. 3.4%</span>
          </div>
        </div>

        {/* Fiyat Pozisyonu */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Fiyat Pozisyonu</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Orta</p>
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <span>₺189 — kategori ort. ₺201</span>
          </div>
        </div>
      </div>

      {/* İki Yan Yana Graf */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fiyat Dağılımı */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Fiyat Dağılımı — Kategoride Konumun
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Senin konumun: ₺150-200 aralığı
            </p>
          </div>
          <div style={{ height: '280px' }}>
            <Bar data={priceDistributionData} options={priceDistributionOptions} />
          </div>
        </div>

        {/* Pazar Payı */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pazar Payı
          </h3>
          <div className="flex items-center gap-6">
            <div style={{ height: '280px', width: '280px' }}>
              <Doughnut data={marketShareData} options={marketShareOptions} />
            </div>
            <div className="flex-1 space-y-3">
              {marketShareData.labels.map((label, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: marketShareData.datasets[0].backgroundColor[idx] }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{label}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    %{marketShareData.datasets[0].data[idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trend Grafiği */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Haftalık Satış Trendi — Sen vs. Kategori Ortalaması
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.primary }} />
              <span className="text-sm text-gray-700 dark:text-gray-300">Senin satışın</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Kategori ortalaması</span>
            </div>
          </div>
        </div>
        <div style={{ height: '320px' }}>
          <Line data={trendData} options={trendOptions} />
        </div>
      </div>

      {/* Dönüşüm Kıyaslaması */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Dönüşüm Oranı — Rakiplere Göre Neredesin?
        </h3>
        <div className="space-y-5">
          {conversionData.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {item.value}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percent}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bilgi Kutusu */}
        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Award className="text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-1">
                Dönüşüm İyileştirme Önerisi
              </p>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                Dönüşüm oranın ortalamanın altında. En büyük etken: ürün görseli sayısı 
                (sen 2, lider 7 fotoğraf kullanıyor)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
