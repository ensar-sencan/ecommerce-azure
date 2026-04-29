'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: searchParams.get('role') || 'customer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const router = useRouter();

  function onChange(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      router.push(form.role === 'seller' ? '/dashboard' : '/products');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Kayıt başarısız.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Hesap Oluştur</h1>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

        {/* Role selector */}
        <div className="flex gap-2 mb-6">
          {['customer', 'seller'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => onChange('role', r)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${form.role === r ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
            >
              {r === 'customer' ? '🛍️ Müşteri' : '🏪 Satıcı'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
            <input value={form.name} onChange={e => onChange('name', e.target.value)} required className="input" placeholder="Ad Soyad" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <input type="email" value={form.email} onChange={e => onChange('email', e.target.value)} required className="input" placeholder="ornek@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <input type="password" value={form.password} onChange={e => onChange('password', e.target.value)} required minLength={8} className="input" placeholder="En az 8 karakter" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Hesap oluşturuluyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Zaten hesabın var mı?{' '}
          <Link href="/auth/login" className="text-primary-600 font-medium hover:underline">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}
