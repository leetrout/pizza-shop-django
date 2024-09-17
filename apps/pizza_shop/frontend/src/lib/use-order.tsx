import { useContext } from 'react';
import { orderContext } from './order-context';

export const useOrder = () => {
  return useContext(orderContext);
};
