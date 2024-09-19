import { useOrder } from '@/lib/use-order';
import { ComponentProps, FC } from 'react';
import { Pizza } from '@/lib/schemas';
import { TransparencyGridIcon } from '@radix-ui/react-icons';
import { Separator } from './ui/separator';
import { PriceBadge } from './price-badge';
import { useOrderTotal } from '@/lib/use-pizza-price';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useQueryClient } from '@tanstack/react-query';

export const OrderSummaryCard: FC = () => {
  const { order } = useOrder();
  const { data: total } = useOrderTotal();
  return (
    <div className="relative w-full h-full border rounded-xl shadow bg-card flex flex-col justify-center gap-2 p-4">
      <h2 className="text-xl font-medium">Your order</h2>
      {!order.pizzas || order.pizzas.length == 0 ? (
        <>
          <TransparencyGridIcon className="text-primary/50 w-full h-full" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 text-muted-foreground">
            Nothing here yet...
          </span>
        </>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="w-full h-full flex flex-col gap-12">
            {order.pizzas?.map((p, i) => (
              <PizzaSummary key={i} pizzaIndex={i} pizza={p} />
            ))}
          </div>
          <div className="flex w-full items-center justify-end gap-4">
            {order.method === 'delivery' && (
              <p className="text-muted-foreground">delivery fee - $5</p>
            )}
            <Badge className="text-xl hover:bg-primary rounded-2xl px-4 py-1">
              Total $ {total?.toFixed(2)}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};

type PizzaSummaryProps = ComponentProps<'div'> & {
  pizza: Pizza;
  pizzaIndex: number;
};

const PizzaSummary: FC<PizzaSummaryProps> = ({ pizza, pizzaIndex }) => {
  const { setOrder, setPizza } = useOrder();
  const client = useQueryClient();
  const remove = () => {
    client.removeQueries({ queryKey: ['pizza_price', pizza], exact: true });
    setOrder((order) => {
      const newPizzas = order.pizzas;
      newPizzas!.splice(pizzaIndex, 1);
      return { ...order, pizzas: newPizzas };
    });
  };
  const edit = () => {
    remove();
    setPizza(pizza);
  };
  return (
    <div className="relative w-full rounded-xl p-2 pt-5 flex items-center gap-6 border-2 border-t-primary border-t-4">
      <div className="flex flex-col items-start min-w-fit">
        <p>
          <span className="text-muted-foreground font-light">size: </span>
          {pizza.size.name}
        </p>
        <p>
          <span className="text-muted-foreground font-light">crust: </span>
          {pizza.crust.name}
        </p>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {pizza.toppings.map((t) => (
          <span key={t.external_id}>{t.name}</span>
        ))}
      </div>
      <div className="absolute top-0 right-0 -translate-x-2 -translate-y-4 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="rounded-lg"
          onClick={edit}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="rounded-lg"
          onClick={remove}
        >
          Remove
        </Button>
      </div>
      <PriceBadge pizza={pizza} />
    </div>
  );
};
