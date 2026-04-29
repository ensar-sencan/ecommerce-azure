'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Star, ShoppingCart, ArrowLeft, Package, Truck } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  sellerName: string;
  avgRating: number;
  reviewCount: number;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  authorName: string;
  createdAt: string;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const { add } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    Promise.all([
      api.get(`/api/products/${id}`),
      api.get(`/api/products/${id}/reviews`),
    ]).then(([pRes, rRes]) => {
      setProduct(pRes.data);
      setReviews(rRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      add({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12 animate-pulse">
          <div className="bg-gray-100 rounded-2xl h-96" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-6 bg-gray-100 rounded w-1/4" />
            <div className="h-24 bg-gray-100 rounded" />
          </div>
        </div>
      </>
    );
  }

  if (!product) return <p className="text-center mt-24 text-gray-400">Ürün bulunamadı.</p>;

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link href="/products" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-6">
          <ArrowLeft size={14} /> Ürünlere Dön
        </Link>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative h-96 bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-4" />
            ) : (
              <div className="flex items-center justify-center h-full text-8xl">📦</div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-sm text-primary-600 font-medium mb-2">{product.category}</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={16} className={s <= Math.round(product.avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {Number(product.avgRating).toFixed(1)} ({product.reviewCount} değerlendirme)
              </span>
            </div>

            <p className="text-3xl font-bold text-primary-600 mb-4">
              ₺{Number(product.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Stock & Seller */}
            <div className="space-y-2 mb-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Package size={14} />
                <span>
                  {product.stock > 0
                    ? <span className="text-green-600 font-medium">Stokta var ({product.stock} adet)</span>
                    : <span className="text-red-500 font-medium">Stok tükendi</span>
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={14} />
                <span>Satıcı: <strong>{product.sellerName}</strong></span>
              </div>
            </div>

            {/* Qty + Add to Cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-50 text-lg font-medium"
                  >−</button>
                  <span className="px-4 py-2 font-medium min-w-[2.5rem] text-center">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-50 text-lg font-medium"
                  >+</button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                    addedToCart
                      ? 'bg-green-600 text-white'
                      : 'btn-primary'
                  }`}
                >
                  <ShoppingCart size={18} />
                  {addedToCart ? 'Sepete Eklendi!' : 'Sepete Ekle'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="border-t border-gray-200 pt-12">
          <h2 className="text-xl font-bold mb-6">
            Değerlendirmeler ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <p className="text-gray-400">Henüz değerlendirme yapılmamış.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                        {r.authorName[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-sm">{r.authorName}</span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={13} className={s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{r.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(r.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
