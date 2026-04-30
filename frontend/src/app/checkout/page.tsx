'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { CheckCircle, Loader2 } from 'lucide-react';

type Step = 'review' | 'placing' | 'success';

export default function CheckoutPage() {
  const { items, total, clear } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [step, setStep] = useState<Step>('review');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0 && step !== 'placing' && step !== 'success') {
      router.replace('/cart');
    }
  }, [mounted, items.length, step, router]);

  async function placeOrder() {
    setStep('placing');
    setError('');
    try {
      const payload = {
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      };
      const { data } = await api.post('/api/orders', payload);
      const id = data.order[0]?.id ?? null;
      setOrderId(id);
      clear();
      setStep('success');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Sipariş verilemedi. Lütfen tekrar deneyin.');
      setStep('review');
    }
  }

  if (step === 'success') {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4">
          <CheckCircle size={72} className="text-green-500 mb-6" />
          <h1 className="text-2xl font-bold mb-2">Siparişiniz Alındı!</h1>
          <p className="text-gray-500 mb-2">Sipariş No: <strong>#{orderId}</strong></p>
          <p className="text-gray-400 text-sm mb-8">Siparişinizin durumunu siparişlerim sayfasından takip edebilirsiniz.</p>
          <div className="flex gap-4">
            <button onClick={() => router.push('/orders')} className="btn-primary">Siparişlerimi Gör</button>
            <button onClick={() => router.push('/products')} className="btn-secondary">Alışverişe Devam</button>
          </div>
        </div>
      </>
    );
  }

  if (!mounted) return null;

  if (items.length === 0 && step !== 'placing' && step !== 'success') {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Siparişi Tamamla</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Delivery info */}
          <div className="card">
            <h2 className="font-semibold text-lg mb-4">Teslimat Bilgileri</h2>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p>{user?.email}</p>
            </div>
            <p className="mt-4 text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
              Bu demo sürümünde adres bilgisi e-posta üzerinden gönderilmektedir.
              Gerçek projede adres formu buraya eklenecektir.
            </p>
          </div>

          {/* Order summary */}
          <div className="card">
            <h2 className="font-semibold text-lg mb-4">Sipariş Özeti</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">
                    {item.name}
                    <span className="text-gray-400 ml-1">×{item.quantity}</span>
                  </span>
                  <span className="font-medium flex-shrink-0">
                    ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between font-bold text-base">
                <span>Genel Toplam</span>
                <span className="text-primary-600">
                  ₺{total().toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>
            )}

            <button
              onClick={placeOrder}
              disabled={step === 'placing'}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {step === 'placing' ? (
                <><Loader2 size={16} className="animate-spin" /> Sipariş Veriliyor...</>
              ) : (
                'Siparişi Onayla'
              )}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
