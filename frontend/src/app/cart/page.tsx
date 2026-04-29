'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, remove, updateQty, total, clear } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <ShoppingBag size={64} className="text-gray-200 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Sepetiniz boş</h2>
          <p className="text-gray-400 mb-8">Alışverişe başlamak için ürünlere göz atın.</p>
          <Link href="/products" className="btn-primary">Ürünleri Keşfet</Link>
        </div>
      </>
    );
  }

  function handleCheckout() {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    router.push('/checkout');
  }

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Sepetim ({items.length} ürün)</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.productId} className="card flex gap-4">
                {/* Image */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-2xl">📦</div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">{item.name}</h3>
                  <p className="text-primary-600 font-bold">
                    ₺{Number(item.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Qty controls */}
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => remove(item.productId)} className="text-gray-300 hover:text-red-400 transition">
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden text-sm">
                    <button
                      onClick={() => updateQty(item.productId, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-gray-50 text-gray-500"
                    >−</button>
                    <span className="px-3 py-1 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-50 text-gray-500"
                    >+</button>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={clear} className="text-sm text-gray-400 hover:text-red-400 transition">
              Sepeti Temizle
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              <h2 className="font-semibold text-lg mb-4">Sipariş Özeti</h2>

              <div className="space-y-2 mb-4 text-sm">
                {items.map(item => (
                  <div key={item.productId} className="flex justify-between text-gray-600">
                    <span className="truncate mr-2">{item.name} x{item.quantity}</span>
                    <span className="flex-shrink-0">₺{(item.price * item.quantity).toLocaleString('tr-TR')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Toplam</span>
                  <span className="text-primary-600">
                    ₺{total().toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">KDV dahil</p>
              </div>

              <button onClick={handleCheckout} className="btn-primary w-full flex items-center justify-center gap-2">
                Siparişi Tamamla <ArrowRight size={16} />
              </button>

              <Link href="/products" className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-3">
                Alışverişe Devam Et
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
