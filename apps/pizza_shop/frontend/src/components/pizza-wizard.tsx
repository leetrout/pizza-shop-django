import { FC } from 'react';
import { SizeCard } from './size-card';
import { CrustCard } from './crust-card';
import { ToppingsCard } from './toppings-card';
import { useOrder } from '@/lib/use-order';
import { Button } from './ui/button';

export const PizzaWizard: FC = () => {
  const { curPizza, setPizza, setOrder } = useOrder();
  if (!curPizza) return null;
  const onClick = () => {
    setOrder((oldOrder) => {
      if (!oldOrder.pizzas) {
        setPizza(undefined);
        return { ...oldOrder, pizzas: [curPizza] };
      }
      setPizza(undefined);
      return { ...oldOrder, pizzas: [...oldOrder.pizzas, curPizza] };
    });
  };
  return (
    <section className="border rounded-xl bg-gradient-to-br from-primary/25 to-transparent p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customize your pizza</h2>
        <Button variant="secondary" onClick={() => setPizza(undefined)}>
          Clear
        </Button>
      </div>
      <div className="grid w-full gap-4 grid-cols-2">
        <SizeCard />
        <CrustCard />
        <ToppingsCard className="col-span-2" />
      </div>
      <Button onClick={onClick}>Add to order</Button>
    </section>
  );
};
