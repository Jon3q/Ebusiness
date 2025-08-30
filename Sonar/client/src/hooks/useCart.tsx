import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';

export type CartItem = { id: string; name: string; price: number; qty: number };
type Action =
  | { type: 'add'; item: CartItem }
  | { type: 'remove'; id: string }
  | { type: 'clear' };

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'add': {
      const idx = state.findIndex(i => i.id === action.item.id);
      if (idx === -1) return [...state, action.item];
      const next = [...state];
      next[idx].qty += action.item.qty;
      return next;
    }
    case 'remove':
      return state.filter(i => i.id !== action.id);
    case 'clear':
      return [];
    default:
      return state;
  }
}

const CartCtx = createContext<{
  cart: CartItem[];
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(reducer, []);
  return (
    <CartCtx.Provider value={{ cart, dispatch }}>
      {children}
    </CartCtx.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
