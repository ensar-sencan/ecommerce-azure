'use client';

import Link from 'next/link';
import { ShoppingCart, BarChart2, Package, ClipboardList } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const count = useCartStore(s => s.count());

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-xl text-primary-600">AzureShop</Link>

        <div className="flex items-center gap-6">
          <Link href="/products" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Ürünler</Link>

          {user?.role === 'seller' && (
            <>
              <Link href="/dashboard" className="flex items-center gap-1 text-accent-600 hover:text-accent-700 text-sm font-medium">
                <BarChart2 size={16} /> Dashboard
              </Link>
              <Link href="/dashboard/products" className="flex items-center gap-1 text-accent-600 hover:text-accent-700 text-sm font-medium">
                <Package size={16} /> Ürünlerim
              </Link>
            </>
          )}

          {user?.role === 'customer' && (
            <Link href="/orders" className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-medium">
              <ClipboardList size={16} /> Siparişlerim
            </Link>
          )}

          <Link href="/cart" className="relative">
            <ShoppingCart size={22} className="text-gray-600 hover:text-gray-900" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user.name}</span>
              <button onClick={logout} className="text-sm text-gray-400 hover:text-red-500">Çıkış</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">Giriş</Link>
              <Link href="/auth/register" className="btn-primary text-sm">Kayıt Ol</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
