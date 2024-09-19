import { ComponentProps, FC } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { CookieIcon } from '@radix-ui/react-icons';
import { useOrder } from '@/lib/use-order';
import { useCrusts } from '@/lib/api';
import { Skeleton } from './ui/skeleton';

export const CrustCard: FC<ComponentProps<'div'>> = (props) => {
  const { data: crusts, isLoading } = useCrusts();
  const { curPizza, setPizza } = useOrder();
  if (!curPizza) return null;
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-2xl">Crust</CardTitle>
        <CardDescription>Choose your favorite crust</CardDescription>
      </CardHeader>
      <CardContent className="flex">
        <div className="w-full flex items-center justify-center">
          <CookieIcon className="w-16 h-16 text-primary" />
        </div>
        {isLoading ? (
          <Skeleton />
        ) : (
          <ToggleGroup
            type="single"
            value={curPizza.crust.name}
            onValueChange={(value) =>
              setPizza((oldPizza) => ({
                ...oldPizza!,
                crust: crusts!.find((c) => c.name === value)!,
              }))
            }
            className="w-full flex flex-col items-start gap-2"
          >
            {crusts!.map((c) => (
              <ToggleGroupItem
                key={c.external_id}
                className="text-xl"
                value={c.name}
              >
                {c.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </CardContent>
    </Card>
  );
};
