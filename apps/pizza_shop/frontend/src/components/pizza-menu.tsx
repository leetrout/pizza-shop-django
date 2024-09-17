import { cn } from '@/lib/utils';
import { ComponentProps, FC } from 'react';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { CrustType, PizzaSizeName } from '@/lib/schemas';
import { Button } from './ui/button';
import { useOrder } from '@/lib/use-order';
import { useCrusts, useSizes, useToppings } from '@/lib/api';
import { Skeleton } from './ui/skeleton';

type MenuPizza = {
  name: string;
  image: string;
  size: PizzaSizeName;
  crust: CrustType;
  toppings: string[];
};

const menu: MenuPizza[] = [
  {
    name: 'Pepperoni Feast',
    image: '/pepperoni.webp',
    size: 'Large',
    crust: 'Thin',
    toppings: ['Pepperoni', 'Extra cheese'],
  },
  {
    name: 'Veggie Delight',
    image: '/veggie.webp',
    size: 'Medium',
    crust: 'Regular',
    toppings: [
      'Mushrooms',
      'Onions',
      'Green peppers',
      'Black olives',
      'Spinach',
    ],
  },
  {
    name: 'Meat Lovers',
    image: '/meat.webp',
    size: 'Extra Large',
    crust: 'Thick',
    toppings: ['Pepperoni', 'Sausage', 'Bacon'],
  },
  {
    name: 'Hawaiian Classic',
    image: '/hawaiian.webp',
    size: 'Small',
    crust: 'Stuffed',
    toppings: ['Pineapple', 'Bacon'],
  },
  {
    name: 'Supreme',
    image: '/supreme.webp',
    size: 'Large',
    crust: 'Regular',
    toppings: [
      'Pepperoni',
      'Sausage',
      'Mushrooms',
      'Onions',
      'Green peppers',
      'Black olives',
    ],
  },
  {
    name: 'Spinach & Cheese',
    image: '/spinach.webp',
    size: 'Medium',
    crust: 'Thin',
    toppings: ['Spinach', 'Extra cheese', 'Mushrooms'],
  },
];

export const PizzaMenu: FC<ComponentProps<'div'>> = ({
  className,
  ...props
}) => {
  const { curPizza } = useOrder();
  if (curPizza) return null;
  return (
    <ScrollArea className="w-full">
      <div
        className={cn('w-max flex items-center gap-2 py-4', className)}
        {...props}
      >
        {menu.map((p, i) => (
          <PizzaMenuCard key={i} pizza={p} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

type PizzaMenuCardProps = ComponentProps<'div'> & { pizza: MenuPizza };
const PizzaMenuCard: FC<PizzaMenuCardProps> = ({
  pizza,
  className,
  ...props
}) => {
  const { data: sizes, isLoading: sizesLoading } = useSizes();
  const { data: crusts, isLoading: crustsLoading } = useCrusts();
  const { data: toppings, isLoading: toppingsLoading } = useToppings();
  const { setPizza } = useOrder();
  const onClick = () => {
    setPizza({
      size: sizes!.find((s) => s.name === pizza.size)!,
      crust: crusts!.find((c) => c.name === pizza.crust)!,
      toppings: pizza.toppings.map(
        (name) => toppings!.find((t) => t.name === name)!,
      ),
    });
  };
  return (
    <div
      className={cn(
        'p-2 w-64 h-64 flex flex-col items-start justify-center border rounded-md gap-2',
        className,
      )}
      {...props}
    >
      {sizesLoading || crustsLoading || toppingsLoading ? (
        <Skeleton />
      ) : (
        <>
          <div
            style={{ backgroundImage: `url(${pizza.image})` }}
            className="bg-cover w-full h-full"
          />
          <div className="flex flex-col w-full gap-2">
            <h3 className="text-xl text-primary font-bold">{pizza.name}</h3>
            <div className="flex gap-2 items-end">
              <div className="text-sm text-muted-foreground text-pretty">
                {pizza.toppings.join(', ')}
              </div>
              <Button onClick={onClick}>Order now</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
