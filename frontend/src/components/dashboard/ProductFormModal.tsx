'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { X, Upload, Loader2 } from 'lucide-react';

interface Category { id: number; name: string; children?: Category[]; }
interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId?: number;
  imageUrl: string;
}

interface Props {
  product: (Product & { id: number }) | null;
  onClose: () => void;
  onSave: () => void;
}

const empty: Omit<Product, 'id'> = { name: '', description: '', price: 0, stock: 0, categoryId: undefined, imageUrl: '' };

export default function ProductFormModal({ product, onClose, onSave }: Props) {
  const [form, setForm] = useState<Omit<Product, 'id'>>(product ? { ...product } : empty);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get('/api/categories').then(r => setCategories(r.data));
  }, []);

  function set(field: string, value: unknown) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/api/upload/image', fd);
      set('imageUrl', data.url);
    } catch {
      setError('Görsel yüklenemedi.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (product?.id) {
        await api.put(`/api/products/${product.id}`, form);
      } else {
        await api.post('/api/products', form);
      }
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Kayıt başarısız.');
    } finally {
      setSaving(false);
    }
  }

  // Flatten category tree for <select>
  const flatCategories: { id: number; label: string }[] = [];
  categories.forEach(c => {
    flatCategories.push({ id: c.id, label: c.name });
    c.children?.forEach(child => flatCategories.push({ id: child.id, label: `  └ ${child.name}` }));
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-lg">{product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Görseli</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-primary-400 transition"
            >
              {form.imageUrl ? (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.imageUrl} alt="" className="h-16 w-16 object-cover rounded-lg" />
                  <p className="text-sm text-gray-500">Değiştirmek için tıklayın</p>
                </div>
              ) : uploading ? (
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Loader2 size={18} className="animate-spin" /> Yükleniyor...
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-400 py-2">
                  <Upload size={24} />
                  <p className="text-sm">Görsel yüklemek için tıklayın</p>
                  <p className="text-xs">PNG, JPG — Maks. 5 MB</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              required
              className="input"
              placeholder="Ürün adını girin"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={3}
              className="input resize-none"
              placeholder="Ürün açıklaması"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
            <select
              value={form.categoryId ?? ''}
              onChange={e => set('categoryId', parseInt(e.target.value))}
              required
              className="input"
            >
              <option value="">Kategori seçin</option>
              {flatCategories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={e => set('price', parseFloat(e.target.value))}
                required
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok *</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={e => set('stock', parseInt(e.target.value))}
                required
                className="input"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">İptal</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={15} className="animate-spin" /> Kaydediliyor...</> : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
