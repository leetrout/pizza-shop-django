import { FC, PropsWithChildren, useState } from 'react';
import { Order, Pizza } from './schemas';
import { orderContext } from './order-context';

export const OrderProvider: FC<PropsWithChildren> = ({ children }) => {
  const [order, setOrder] = useState<Partial<Order>>({
    status: 'pending',
    method: 'delivery',
  });
  const [curPizza, setPizza] = useState<Pizza | undefined>();
  return (
    <orderContext.Provider value={{ order, setOrder, curPizza, setPizza }}>
      {children}
    </orderContext.Provider>
  );
};
