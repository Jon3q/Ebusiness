import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { useCart } from '../hooks/useCart';

type Product = { id: string; name: string; price: number };

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const { dispatch } = useCart();

  useEffect(() => {
    api.get<Product[]>('/products')
       .then(res => setProducts(res.data))
       .catch(console.error);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {products.map(p => (
        <div key={p.id} className="border rounded-xl p-4 flex flex-col">
          <h2 className="text-xl mb-2">{p.name}</h2>
          <span className="mb-4">{p.price.toFixed(2)} PLN</span>
          <button
            className="mt-auto px-4 py-2 rounded bg-blue-600 text-white"
            onClick={() =>
              dispatch({ type: 'add', item: { ...p, qty: 1 } })
            }
          >
            Dodaj do koszyka
          </button>
        </div>
      ))}
    </div>
  );
}
