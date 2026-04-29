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

  const prompt = `Sen bir e-ticaret analitiği uzmanısın. Aşağıdaki satıcı verilerini analiz et ve Türkçe öneriler sun.

Ürün Performans Verileri:
${JSON.stringify(productStats, null, 2)}

Düşük Stoklu Ürünler (stok < 10):
${JSON.stringify(lowStockItems, null, 2)}

Lütfen şu konularda 3-5 maddelik JSON formatında öneriler ver:
- price_optimization: Fiyat optimizasyon önerileri
- stock_alerts: Stok uyarıları ve aksiyonlar
- opportunities: Fırsatlar (düşük görüntülenme vs yüksek dönüşüm gibi)
- general: Genel satış stratejisi önerileri

Format: { "price_optimization": [...], "stock_alerts": [...], "opportunities": [...], "general": [...] }`;

  const response = await openai.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = { getAIRecommendations };
