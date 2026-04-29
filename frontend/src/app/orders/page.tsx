'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import api from '@/lib/api';
import { Package, ChevronRight } from 'lucide-react';

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  itemCount: number;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Beklemede',   color: 'bg-yellow-50 text-yellow-700' },
  confirmed: { label: 'Onaylandı',   color: 'bg-blue-50 text-blue-700' },
  shipped:   { label: 'Kargoda',     color: 'bg-purple-50 text-purple-700' },
  delivered: { label: 'Teslim Edildi', color: 'bg-green-50 text-green-700' },
  cancelled: { label: 'İptal',       color: 'bg-red-50 text-red-600' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/orders/my')
      .then(r => setOrders(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Siparişlerim</h1>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="card text-center py-16">
            <Package size={48} className="mx-auto text-gray-200 mb-4" />
            <h3 className="font-semibold text-gray-600 mb-2">Henüz siparişiniz yok</h3>
            <p className="text-gray-400 text-sm mb-6">İlk siparişinizi vermek için ürünlere göz atın.</p>
            <Link href="/products" className="btn-primary">Alışverişe Başla</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => {
              const status = STATUS_LABELS[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-600' };
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="card flex items-center justify-between hover:border-primary-300 hover:shadow-md transition group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
                      <Package size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Sipariş #{order.id}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {' · '}{order.itemCount} ürün
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₺{Number(order.totalPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
