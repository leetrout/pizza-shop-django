import { useToppings } from '@/lib/api';
import { ComponentProps, FC } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { ResetIcon, StackIcon } from '@radix-ui/react-icons';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { useOrder } from '@/lib/use-order';
import { Topping } from '@/lib/schemas';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

export const ToppingsCard: FC<ComponentProps<'div'>> = (props) => {
  const { curPizza, setPizza } = useOrder();
  const { data: toppings, isLoading } = useToppings();
  return (
    <Card {...props}>
      <CardHeader className=" flex-row justify-between">
        <div className="space-y-2">
          <CardTitle className="text-2xl">Toppings</CardTitle>
          <CardDescription>Time for toppings</CardDescription>
        </div>
        <Button
          variant="secondary"
          className="flex gap-2 justify-between items-center"
          onClick={() =>
            setPizza((oldPizza) => ({ ...oldPizza!, toppings: [] }))
          }
        >
          <ResetIcon />
          Reset
        </Button>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="flex">
        <div className="w-full flex items-center justify-center">
          <StackIcon className="w-32 h-32 text-primary" />
        </div>
        {isLoading ? (
          <Skeleton />
        ) : (
          <ToggleGroup
            disabled={isLoading}
            type="multiple"
            value={curPizza?.toppings.map((t) => t.name)}
            onValueChange={(value) => {
              const newToppings = value;
              setPizza((oldPizza) => ({
                ...oldPizza!,
                toppings: newToppings.map(
                  (name) => toppings!.find((t) => t.name === name)!,
                ),
              }));
            }}
            className="w-full max-h-64 flex flex-col flex-wrap items-start gap-2"
          >
            {toppings!.map((t, i) => (
              <ToppingToggleItem key={i} topping={t} />
            ))}
          </ToggleGroup>
        )}
      </CardContent>
    </Card>
  );
};

type ToppingToggleItemParams = {
  topping: Topping;
};

const ToppingToggleItem: FC<ToppingToggleItemParams> = ({
  topping: { name, price },
}) => {
  return (
    <ToggleGroupItem value={name} className="text-xl">
      {name}
      <span className="text-muted-foreground ml-2">- ${price}</span>
    </ToggleGroupItem>
  );
};
