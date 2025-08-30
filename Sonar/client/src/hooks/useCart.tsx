import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';

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

      return state.map((i, n) =>
        n === idx ? { ...i, qty: i.qty + action.item.qty } : i
      );
    }
    case 'remove':
      return state.filter(i => i.id !== action.id);
    case 'clear':
      return [];
    default:
      return state;
  }
}

interface CartContext {
  cart: CartItem[];
  dispatch: Dispatch<Action>;
}

const CartCtx = createContext<CartContext | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(reducer, []);
  return (
    <CartCtx.Provider value={{ cart, dispatch }}>
      {children}
    </CartCtx.Provider>
  );
};

export const useCart = (): CartContext => {
  const ctx = useContext(CartCtx);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
};
