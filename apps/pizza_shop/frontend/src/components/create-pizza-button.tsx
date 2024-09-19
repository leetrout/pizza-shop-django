import { FC } from 'react';
import { Button, ButtonProps } from './ui/button';
import { useOrder } from '@/lib/use-order';
import { useDefaultPizza } from '@/lib/use-default-pizza';

export const CreatePizzaButton: FC<ButtonProps> = (props) => {
  const { pizza, isLoading } = useDefaultPizza();
  const { curPizza, setPizza } = useOrder();
  if (curPizza) return null;
  const onClick = () => {
    setPizza(pizza);
  };
  return (
    <Button disabled={isLoading} onClick={onClick} {...props}>
      Create your own
    </Button>
  );
};
