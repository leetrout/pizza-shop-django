import { Pizza } from '@/lib/schemas';
import { FC } from 'react';
import { Badge } from './ui/badge';
import { usePizzaPrice } from '@/lib/use-pizza-price';

type PriceBadgeProps = {
  pizza: Pizza;
};

export const PriceBadge: FC<PriceBadgeProps> = ({ pizza }) => {
  const { data: price } = usePizzaPrice(pizza);
  if (!price) return null;
  return (
    <Badge className="hover:bg-primary absolute text-sm right-0 bottom-0 -translate-x-2 translate-y-3 rounded-full">
      ${price.toFixed(2)}
    </Badge>
  );
};
