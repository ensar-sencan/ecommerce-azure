'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import api from '@/lib/api';
import { ArrowLeft, Package } from 'lucide-react';

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];
const STATUS_LABELS: Record<string, string> = {
  pending: 'Beklemede', confirmed: 'Onaylandı', shipped: 'Kargoda', delivered: 'Teslim Edildi', cancelled: 'İptal',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/orders/${id}`)
      .then(r => setItems(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
      </div>
    </>
  );

  if (!items.length) return <p className="text-center mt-24 text-gray-400">Sipariş bulunamadı.</p>;

  const order = items[0];
  const currentStep = STATUS_STEPS.indexOf(order.status);
  const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/orders" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-6">
          <ArrowLeft size={14} /> Siparişlerime Dön
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Sipariş #{order.orderId}</h1>
            <p className="text-sm text-gray-400 mt-1">
              {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Status tracker */}
        {order.status !== 'cancelled' && (
          <div className="card mb-6">
            <div className="flex items-center">
              {STATUS_STEPS.map((s, i) => (
                <div key={s} className="flex-1 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-colors ${
                    i <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <p className={`text-xs text-center ${i <= currentStep ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
                    {STATUS_LABELS[s]}
                  </p>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`absolute h-0.5 w-full max-w-[calc(100%/4)] translate-x-1/2 top-4 ${i < currentStep ? 'bg-primary-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="card mb-6 p-0 overflow-hidden">
          <h2 className="font-semibold px-6 py-4 border-b border-gray-100">Ürünler</h2>
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0">
              <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                {item.imageUrl
                  ? <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                  : <div className="flex items-center justify-center h-full text-xl">📦</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.productId}`} className="font-medium text-sm hover:text-primary-600 line-clamp-1">
                  {item.productName}
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">
                  ₺{Number(item.unitPrice).toLocaleString('tr-TR')} × {item.quantity}
                </p>
              </div>
              <p className="font-bold text-sm flex-shrink-0">
                ₺{(item.unitPrice * item.quantity).toLocaleString('tr-TR')}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="card">
          <div className="flex justify-between text-lg font-bold">
            <span>Toplam</span>
            <span className="text-primary-600">₺{total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </main>
    </>
  );
}
