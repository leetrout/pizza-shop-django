import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pizza } from './schemas';
import { useOrder } from './use-order';

const getPizzaPrice = (pizza: Pizza): number => {
  const basePrice = 5;
  const toppingsTotal = pizza.toppings.reduce((prev, cur) => {
    return prev + cur.price;
  }, 0);
  return (
    Math.round(
      (basePrice + toppingsTotal + pizza.crust.price) *
        pizza.size.price_modifier *
        100,
    ) / 100
  );
};

export const usePizzaPrice = (pizza: Pizza) => {
  const query = useQuery({
    queryKey: ['pizza_price', pizza],
    queryFn: () => {
      return getPizzaPrice(pizza);
    },
  });
  const client = useQueryClient();
  client.invalidateQueries({ queryKey: ['order_total'] });
  return query;
};

export const useOrderPizzaPrices = () => {
  const { order } = useOrder();
  return useQueries({
    queries:
      order.pizzas?.map((p) => ({
        queryKey: ['pizza_price', p],
        queryFn: () => getPizzaPrice(p),
      })) || [],
  });
};

export const useOrderTotal = () => {
  const client = useQueryClient();
  const { order } = useOrder();
  return useQuery({
    queryKey: ['order_total', order],
    queryFn: () => {
      const data = client.getQueriesData<number>({
        queryKey: ['pizza_price'],
      });
      return (
        data.reduce((prev, cur) => prev + ((cur.at(1) as number) || 0), 0) +
        (order.method! === 'delivery' ? 5 : 0)
      );
    },
  });
};
