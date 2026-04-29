'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import api from '@/lib/api';
import { Plus, Edit2, Trash2, Package, Eye, ShoppingBag } from 'lucide-react';
import ProductFormModal from '@/components/dashboard/ProductFormModal';

interface SellerProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  category: string;
  imageUrl: string;
  views: number;
  sales: number;
  revenue: number;
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);

  async function fetchProducts() {
    const { data } = await api.get('/api/seller/products');
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => { fetchProducts(); }, []);

  async function handleDelete(id: number) {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    await api.delete(`/api/products/${id}`);
    setProducts(p => p.filter(x => x.id !== id));
  }

  function openCreate() { setEditingProduct(null); setModalOpen(true); }
  function openEdit(p: SellerProduct) { setEditingProduct(p); setModalOpen(true); }

  function onSave() {
    setModalOpen(false);
    fetchProducts();
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Ürünlerim</h1>
            <p className="text-gray-500 text-sm mt-1">{products.length} ürün listelendi</p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Yeni Ürün Ekle
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="card text-center py-16">
            <Package size={48} className="mx-auto text-gray-200 mb-4" />
            <h3 className="font-semibold text-gray-600 mb-2">Henüz ürün eklemediniz</h3>
            <p className="text-gray-400 text-sm mb-6">İlk ürününüzü ekleyerek satışa başlayın.</p>
            <button onClick={openCreate} className="btn-primary">İlk Ürünü Ekle</button>
          </div>
        ) : (
          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Ürün</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Fiyat</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Stok</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">
                    <span className="flex items-center justify-end gap-1"><Eye size={13} />Görüntülenme</span>
                  </th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">
                    <span className="flex items-center justify-end gap-1"><ShoppingBag size={13} />Satış</span>
                  </th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Gelir</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      ₺{Number(p.price).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.stock === 0         ? 'bg-red-50 text-red-600'
                        : p.stock < 10        ? 'bg-yellow-50 text-yellow-600'
                        :                       'bg-green-50 text-green-700'
                      }`}>
                        {p.stock === 0 ? 'Tükendi' : `${p.stock} adet`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">{(p.views ?? 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-gray-600">{(p.sales ?? 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-medium text-green-700">
                      ₺{Number(p.revenue ?? 0).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setModalOpen(false)}
          onSave={onSave}
        />
      )}
    </>
  );
}
