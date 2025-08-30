import { useCart } from '../hooks/useCart';
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  const sendCart = async () => {
    await api.post('/cart', cart);
    navigate('/payment');
  };

  if (!cart.length) return <p>Koszyk jest pusty.</p>;

  return (
    <div>
      <ul className="mb-4">
        {cart.map(i => (
          <li key={i.id} className="flex justify-between mb-2">
            {i.name} × {i.qty}
            <span>{(i.price * i.qty).toFixed(2)} PLN</span>
          </li>
        ))}
      </ul>
      <p className="font-bold mb-4">Razem: {total.toFixed(2)} PLN</p>
      <button
        className="px-4 py-2 rounded bg-green-600 text-white"
        onClick={sendCart}
      >
        Zapisz koszyk i przejdź do płatności
      </button>
    </div>
  );
}
