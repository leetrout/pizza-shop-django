import { createContext, Dispatch, SetStateAction } from 'react';
import { Order, Pizza } from './schemas';

type OrderContext = {
  order: Partial<Order>;
  setOrder: Dispatch<SetStateAction<Partial<Order>>>;
  curPizza?: Pizza;
  setPizza: Dispatch<SetStateAction<Pizza | undefined>>;
};

export const orderContext = createContext<OrderContext>({
  order: {},
  setOrder: () => {},
  setPizza: () => {},
});
