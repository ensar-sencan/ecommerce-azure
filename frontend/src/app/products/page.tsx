'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { Search, Star, ShoppingCart } from 'lucide-react';

// Kategori bazlı görsel sistem (fallback için)
function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    'Cilt Bakimi': '🧴',
    'Günes Bakimi': '☀️',
    'Saç Bakimi': '💇',
    'Anne & Bebek': '👶',
    'Vitamin & Saglik': '💊',
    'Makyaj': '💄',
    'Parfüm': '🌸',
  };
  return emojiMap[category] || '🛍️';
}

function getCategoryGradient(category: string): string {
  const gradientMap: Record<string, string> = {
    'Cilt Bakimi': 'from-blue-400 to-purple-500',
    'Günes Bakimi': 'from-yellow-400 to-orange-500',
    'Saç Bakimi': 'from-pink-400 to-red-500',
    'Anne & Bebek': 'from-green-400 to-teal-500',
    'Vitamin & Saglik': 'from-indigo-400 to-blue-500',
    'Makyaj': 'from-rose-400 to-pink-500',
    'Parfüm': 'from-purple-400 to-indigo-500',
  };
  return gradientMap[category] || 'from-gray-400 to-gray-500';
}

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  avgRating: number;
  reviewCount: number;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const add = useCartStore(s => s.add);

  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(true);
      console.log('🔍 Fetching products with search:', search);
      api.get('/api/products', { params: { search, limit: 24 } })
        .then(r => {
          console.log('✅ Products received:', r.data);
          setProducts(r.data.products);
        })
        .catch(err => {
          console.error('❌ Error fetching products:', err);
          console.error('Error details:', err.response?.data || err.message);
        })
        .finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(delay);
  }, [search]);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search bar */}
        <div className="relative mb-8 max-w-lg">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Ürün ara..."
            className="input pl-10"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition group">
                <Link href={`/products/${p.id}`}>
                  <div className={`relative h-44 bg-gradient-to-br ${getCategoryGradient(p.category)} flex items-center justify-center`}>
                    {p.imageUrl ? (
                      <Image 
                        src={p.imageUrl} 
                        alt={p.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition"
                        unoptimized
                      />
                    ) : (
                      <div className="text-7xl">{getCategoryEmoji(p.category)}</div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                      {p.category}
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">{p.category}</p>
                  <Link href={`/products/${p.id}`}>
                    <h3 className="font-medium text-sm line-clamp-2 mb-2 hover:text-primary-600">{p.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-3">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">{Number(p.avgRating).toFixed(1)} ({p.reviewCount})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary-600">₺{Number(p.price).toLocaleString('tr-TR')}</span>
                    <button
                      onClick={() => add({ productId: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl })}
                      disabled={p.stock === 0}
                      className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 disabled:opacity-50 transition"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <p className="text-center text-gray-400 py-24">Ürün bulunamadı.</p>
        )}
      </main>
    </>
  );
}
