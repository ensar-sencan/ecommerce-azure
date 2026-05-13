'use client';

import { useState } from 'react';
import { 
  RefreshCw, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  Target,
  MessageSquare,
  Sparkles
} from 'lucide-react';

// Backend bağlantı notu:
// Bu sayfadaki öneriler backend'den gelecek
// GET /api/seller/ai-coach endpoint'i çağrılacak
// Azure OpenAI bu endpoint'e bağlı, satıcının son 30 günlük verisini analiz ediyor
// Şu an statik data ile çalışıyor, gerçek data için endpoint hazır olunca değiştirilecek

export default function AICoach() {
  const [question, setQuestion] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simüle edilmiş sendPrompt fonksiyonu (gerçek sistemde global olacak)
  const sendPrompt = (prompt) => {
    console.log('AI Koç\'a gönderilen prompt:', prompt);
    alert(`AI Koç'a gönderildi: "${prompt}"\n\n(Gerçek sistemde bu mesaj AI chat'e gönderilecek)`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleQuickQuestion = (q) => {
    setQuestion(q);
  };

  const handleSubmitQuestion = () => {
    if (question.trim()) {
      sendPrompt(question);
      setQuestion('');
    }
  };

  // Günlük aksiyon kartları
  const actions = [
    {
      type: 'urgent',
      badge: 'Acil',
      badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      borderColor: 'border-l-red-500',
      icon: AlertTriangle,
      iconColor: 'text-red-600 dark:text-red-400',
      title: 'Rakip stoğu bitiyor — hemen harekete geç',
      description: 'TechStore_34 isimli rakip satıcının stoğunda yalnızca 3 ürün kaldı. Geçmiş veriye göre bu durum ortalama 18 saat içinde stok bitişine dönüşüyor. Fiyatını %5-8 artırırsan talep sana kayacak, gelirini düşürmeden satışını artırabilirsin.',
      actionLabel: 'Fiyatı ₺189 → ₺199 yap',
      actionPrompt: 'Ürün fiyatını güncellemek istiyorum'
    },
    {
      type: 'suggestion',
      badge: 'Öneri',
      badgeColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      borderColor: 'border-l-yellow-500',
      icon: Lightbulb,
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      title: 'Ürün açıklamanı uzat, dönüşüm oranın artacak',
      description: 'Mevcut ürün açıklaman 180 kelime. Aynı kategorideki en iyi dönüşüm oranına sahip satıcılar ortalama 320 kelime kullanıyor. Teknik özellik, kullanım senaryosu ve garanti bilgisi eklemen önerilir.',
      actionLabel: 'Açıklama önerisi oluştur',
      actionPrompt: 'Telefon kılıfım için 320 kelimelik ürün açıklaması yaz'
    },
    {
      type: 'opportunity',
      badge: 'Fırsat',
      badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      borderColor: 'border-l-green-500',
      icon: TrendingUp,
      iconColor: 'text-green-600 dark:text-green-400',
      title: 'Hafta sonu kampanyası başlat — satışın %67 artıyor',
      description: 'Son 12 haftanın verisi incelendiğinde Cumartesi-Pazar günleri bu kategoride satışlar hafta içine göre %67 daha fazla. Cuma akşamı 20:00\'de %10 indirim kampanyası başlatman bu fırsatı yakalamanı sağlar.',
      actionLabel: 'Kampanya planla',
      actionPrompt: 'Hafta sonu kampanyası için ne yapmalıyım'
    }
  ];

  // Performans özeti
  const strengths = [
    'Fiyat rekabetçiliği',
    'Teslimat puanı',
    'Stok tutarlılığı'
  ];

  const improvements = [
    'Ürün görseli sayısı',
    'Açıklama uzunluğu',
    'Yorum yanıt süresi'
  ];

  // Hızlı sorular
  const quickQuestions = [
    'En iyi fiyat stratejim ne olmalı?',
    'Hangi ürünüm trend?',
    'Rakiplerimle nasıl rekabet ederim?'
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-purple-600 dark:text-purple-400" size={32} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Koç
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Verilerine dayalı, bugün için 3 aksiyon önerisi hazır
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Son analiz: 5 dakika önce
          </span>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            title="Yenile"
          >
            <RefreshCw size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Günlük 3 Aksiyon Kartı */}
      <div className="space-y-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <div
              key={idx}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 ${action.borderColor} border border-gray-200 dark:border-gray-700`}
            >
              {/* Üst Kısım */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <Icon className={action.iconColor} size={24} />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${action.badgeColor} whitespace-nowrap ml-4`}>
                  {action.badge}
                </span>
              </div>

              {/* Alt Kısım - Aksiyon */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Önerilen Aksiyon
                  </span>
                  <button
                    onClick={() => sendPrompt(action.actionPrompt)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition shadow-sm"
                  >
                    {action.actionLabel}
                  </button>
                </div>
                <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition">
                  Bu öneriyi atla
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performans Özeti */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Bu haftanın AI analizi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Güçlü Yönler */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Güçlü Yönlerin
              </h3>
            </div>
            <ul className="space-y-2">
              {strengths.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Geliştirmeni Gerekenler */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="text-orange-600 dark:text-orange-400" size={20} />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Geliştirmeni Gerekenler
              </h3>
            </div>
            <ul className="space-y-2">
              {improvements.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Bu Hafta Skor */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 shadow-sm text-white">
            <div className="flex items-center gap-2 mb-4">
              <Target size={20} />
              <h3 className="font-semibold">Bu Hafta Skor</h3>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold mb-2">74</p>
              <p className="text-blue-100 text-sm mb-3">/100</p>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-blue-100">Geçen hafta: 68</span>
                <div className="flex items-center gap-1 text-green-300">
                  <TrendingUp size={14} />
                  <span className="font-semibold">+6</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Serbest Soru Alanı */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="text-purple-600 dark:text-purple-400" size={24} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            AI Koçuna Sor
          </h2>
        </div>

        {/* Textarea */}
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Örn: Bu hafta hangi ürünüme odaklanmalıyım?"
          className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />

        {/* Hızlı Öneri Chip'leri */}
        <div className="flex flex-wrap gap-2 mt-3 mb-4">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickQuestion(q)}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Gönder Butonu */}
        <button
          onClick={handleSubmitQuestion}
          disabled={!question.trim()}
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Koça Sor
        </button>
      </div>
    </div>
  );
}
