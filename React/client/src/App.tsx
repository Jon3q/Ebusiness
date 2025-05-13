import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import Products from './pages/Products';
import Cart      from './pages/Cart';
import Payment   from './pages/Payment';

const Layout = () => (
  <div className="p-6 max-w-4xl mx-auto">
    <nav className="flex gap-4 mb-6 text-lg">
      <Link to="/">Produkty</Link>
      <Link to="/cart">Koszyk</Link>
      <Link to="/payment">Płatności</Link>
    </nav>
    <Outlet />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Products />} />
          <Route path="cart" element={<Cart />} />
          <Route path="payment" element={<Payment />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
