import { useState } from 'react';
import type { FormEvent } from 'react';
import { useCart } from '../hooks/useCart';
import { api } from '../api/axios';

export default function Payment() {
  const { cart, dispatch } = useCart();
  const [status, setStatus] = useState<string | null>(null);

  const handlePay = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/payment', { cart });
      dispatch({ type: 'clear' });
      setStatus('✅ Płatność przyjęta, dziękujemy!');
    } catch {
      setStatus('❌ Coś poszło nie tak');
    }
  };

  return (
    <form onSubmit={handlePay} className="max-w-sm space-y-4">
      <input
        required
        placeholder="Numer karty"
        className="border p-2 w-full rounded"
      />
      <input required placeholder="MM/YY" className="border p-2 w-full rounded" />
      <input required placeholder="CVC" className="border p-2 w-full rounded" />
      <button
        className="px-4 py-2 w-full rounded bg-purple-600 text-white"
        type="submit"
      >
        Zapłać
      </button>
      {status && <p className="mt-4">{status}</p>}
    </form>
  );
}
