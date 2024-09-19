import { ComponentProps, FC } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { ColorWheelIcon } from '@radix-ui/react-icons';
import { useOrder } from '@/lib/use-order';
import { cn } from '@/lib/utils';
import { useSizes } from '@/lib/api';
import { Skeleton } from './ui/skeleton';

export const SizeCard: FC<ComponentProps<'div'>> = (props) => {
  const { data: sizes, isLoading } = useSizes();
  const { curPizza, setPizza } = useOrder();
  if (!curPizza) return null;
  const iconSize = {
    Small: 'w-6 h-6',
    Medium: 'w-10 h-10',
    Large: 'w-16 h-16',
    'Extra Large': 'w-32 h-32',
  };
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-2xl">Size</CardTitle>
        <CardDescription>Choose the size of your pizza</CardDescription>
      </CardHeader>
      <CardContent className="flex">
        <div className="w-full flex items-center justify-center">
          <ColorWheelIcon
            className={cn(
              iconSize[curPizza.size.name],
              'transition-all',
              'text-primary',
            )}
          />
        </div>
        {isLoading ? (
          <Skeleton />
        ) : (
          <ToggleGroup
            type="single"
            value={curPizza.size.name}
            onValueChange={(value) =>
              setPizza((oldPizza) => ({
                ...oldPizza!,
                size: sizes!.find((s) => s.name === value)!,
              }))
            }
            className="w-full flex flex-col items-start gap-2"
          >
            {sizes?.map((s) => (
              <ToggleGroupItem
                key={s.external_id}
                className="text-xl"
                value={s.name}
              >
                {s.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </CardContent>
    </Card>
  );
};
