import Link from 'next/link';
import { ShoppingBag, BarChart2, Zap, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">AzureShop</h1>
          <p className="text-xl opacity-90 mb-10">
            Türkiye'nin Azure bulut altyapısı üzerinde çalışan akıllı e-ticaret platformu.
            Satıcılara yapay zeka destekli rakip analizi sunuyoruz.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition">
              Ürünleri Keşfet
            </Link>
            <Link href="/auth/register?role=seller" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition">
              Satıcı Ol
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Neden AzureShop?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: ShoppingBag, title: 'Kolay Alışveriş', desc: 'Kategorilere göre filtrele, sepete ekle, güvenle öde.' },
            { icon: BarChart2, title: 'Rakip Analizi', desc: 'Kendi kategorindeki rakipleri anonim olarak karşılaştır.' },
            { icon: Zap,        title: 'AI Öneriler', desc: 'Azure OpenAI destekli fiyat ve stok optimizasyon önerileri.' },
            { icon: Shield,     title: 'Azure Güvenliği', desc: 'Enterprise düzey güvenlik, %99.9 uptime garantisi.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card text-center">
              <Icon className="mx-auto mb-4 text-primary-600" size={32} />
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-100 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Satıcı Planları</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Ücretsiz', price: '₺0', features: ['Ürün yönetimi', 'Kendi satış istatistikleri', 'Sipariş takibi'], highlight: false },
              { name: 'Standart', price: '₺299/ay', features: ['Ücretsiz plan +', 'Rakip fiyat ortalaması', 'Kategori fiyat sıralaması', 'Pazar payı görünümü'], highlight: true },
              { name: 'Premium', price: '₺799/ay', features: ['Standart plan +', 'AI fiyat önerileri', 'Stok fırsat uyarıları', 'Trend analizi', 'Öncelikli destek'], highlight: false },
            ].map(({ name, price, features, highlight }) => (
              <div key={name} className={`card ${highlight ? 'border-primary-500 border-2 relative' : ''}`}>
                {highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs px-3 py-1 rounded-full">
                    En Popüler
                  </span>
                )}
                <h3 className="font-bold text-xl mb-1">{name}</h3>
                <p className="text-3xl font-bold text-primary-600 mb-6">{price}</p>
                <ul className="space-y-2 mb-8">
                  {features.map(f => (
                    <li key={f} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/register?role=seller" className={`block text-center py-2 rounded-lg font-medium transition ${highlight ? 'btn-primary' : 'btn-secondary'}`}>
                  Başla
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
