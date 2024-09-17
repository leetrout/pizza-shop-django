import { FC } from 'react';
import { useOrder } from '@/lib/use-order';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Method } from '@/lib/schemas';
import { AvatarIcon, RocketIcon } from '@radix-ui/react-icons';

export const MethodSwitch: FC = () => {
  const { order, setOrder } = useOrder();
  return (
    <ToggleGroup
      type="single"
      size="lg"
      value={order.method}
      onValueChange={(value) =>
        setOrder((oldOrder) => ({ ...oldOrder, method: value as Method }))
      }
    >
      <ToggleGroupItem
        value="pickup"
        className="flex gap-2 text-xl data-[state=on]:bg-primary/25"
      >
        Pickup <AvatarIcon className="w-6 h-6" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="delivery"
        className="flex gap-2 text-xl data-[state=on]:bg-primary/25"
      >
        Delivery <RocketIcon className="w-6 h-6" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
