const OpenAI = require('openai');

let client;

function getOpenAIClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
      defaultQuery: { 'api-version': '2024-02-15-preview' },
      defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_KEY },
    });
  }
  return client;
}

async function getAIRecommendations(productStats, lowStockItems) {
  const openai = getOpenAIClient();

  // Calculate some metrics for better AI insights
  const totalRevenue = productStats.reduce((sum, p) => sum + (p.revenue || 0), 0);
  const totalViews = productStats.reduce((sum, p) => sum + (p.views || 0), 0);
  const avgConversionRate = totalViews > 0 ? (productStats.reduce((sum, p) => sum + (p.sales || 0), 0) / totalViews * 100) : 0;

  const prompt = `Sen bir e-ticaret ve satış stratejisi uzmanısın. Aşağıdaki satıcı verilerini analiz et ve Türkçe, aksiyon odaklı öneriler sun.

PERFORMANS VERİLERİ:
- Toplam Gelir: ₺${totalRevenue.toLocaleString('tr-TR')}
- Toplam Görüntülenme: ${totalViews}
- Ortalama Dönüşüm Oranı: %${avgConversionRate.toFixed(2)}

ÜRÜN DETAYLARI:
${JSON.stringify(productStats.slice(0, 10), null, 2)}

DÜŞÜK STOKLU ÜRÜNLER (Kritik):
${JSON.stringify(lowStockItems, null, 2)}

Lütfen şu konularda SOMUT ve AKSİYON ODaklı öneriler ver:

1. price_optimization: Fiyat optimizasyon önerileri (hangi ürünün fiyatını nasıl değiştirmeli)
2. stock_alerts: Stok yönetimi aksiyonları (hangi ürün için ne yapmalı)
3. opportunities: Fırsatlar (hangi ürüne odaklanmalı, neden)
4. general: Genel satış stratejisi (somut adımlar)

Her kategoride 3-4 madde olsun. Her madde bir cümle olsun ve spesifik olsun.

ÖRNEK FORMAT:
{
  "price_optimization": [
    "X ürününün fiyatını %10 düşürerek daha fazla satış yapabilirsiniz",
    "Y ürünü kategoride en ucuz, fiyatı %5 artırabilirsiniz"
  ],
  "stock_alerts": [
    "Z ürününün stoğu kritik seviyede, acilen 50 adet sipariş verin"
  ],
  "opportunities": [
    "A ürünü yüksek görüntülenme ama düşük satış, ürün açıklamasını iyileştirin"
  ],
  "general": [
    "En çok satan ürünlerinizi ana sayfada öne çıkarın"
  ]
}

JSON formatında döndür:`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [
        { 
          role: 'system', 
          content: 'Sen bir e-ticaret analisti ve satış stratejisti uzmanısın. Somut, aksiyon odaklı ve ölçülebilir öneriler verirsin.' 
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('AI recommendations error:', error);
    // Fallback recommendations if AI fails
    return {
      price_optimization: [
        'Kategori ortalamasının üzerindeki ürünlerinizin fiyatlarını gözden geçirin',
        'Düşük satış yapan ürünlerde %10-15 indirim kampanyası deneyin',
        'En çok satan ürünlerinizin fiyatını sabit tutun'
      ],
      stock_alerts: lowStockItems.map(item => 
        `${item.name} ürününün stoğu ${item.stock} adete düştü, acilen sipariş verin`
      ),
      opportunities: [
        'Yüksek görüntülenme alan ama satış yapmayan ürünlerin açıklamalarını iyileştirin',
        'En çok satan ürünlerinizi ana sayfada öne çıkarın',
        'Müşteri yorumlarına hızlı yanıt vererek güven oluşturun'
      ],
      general: [
        'Düzenli olarak rakip fiyatlarını takip edin',
        'Stok yönetiminizi otomatikleştirin',
        'Müşteri geri bildirimlerini ürün geliştirmede kullanın',
        'Sezonluk kampanyalar planlayın'
      ]
    };
  }
}

module.exports = { getAIRecommendations };
