import { OrderStatus } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import {
  CheckIcon,
  ColorWheelIcon,
  HandIcon,
  PersonIcon,
  RocketIcon,
  SunIcon,
} from '@radix-ui/react-icons';
import { IconProps } from '@radix-ui/react-icons/dist/types';
import { ComponentProps, FC } from 'react';

type OrderStatusIndicatorProps = ComponentProps<'div'> & {
  status: OrderStatus;
};
export const OrderStatusIndicator: FC<OrderStatusIndicatorProps> = ({
  status,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'w-48 h-48 p-4 flex flex-col items-center gap-2 justify-center',
        className,
      )}
      {...props}
    >
      <OrderStatusIcon status={status} className="w-full h-full text-primary" />
      <p className="text-primary text-xl font-bold">
        {status.charAt(0).toUpperCase() + status.slice(1).split('_').join(' ')}
      </p>
    </div>
  );
};

const OrderStatusIcon: FC<IconProps & { status: OrderStatus }> = ({
  status,
  className,
  ...props
}) => {
  switch (status) {
    case 'pending':
      return (
        <ColorWheelIcon className={cn('animate-spin', className)} {...props} />
      );
    case 'making':
      return <HandIcon className={cn('animate-pulse', className)} {...props} />;
    case 'baking':
      return <SunIcon className={cn('animate-pulse', className)} {...props} />;
    case 'on_the_way':
      return (
        <RocketIcon className={cn('animate-bounce', className)} {...props} />
      );
    case 'ready_for_pickup':
      return (
        <PersonIcon className={cn('animate-pulse', className)} {...props} />
      );
    case 'complete':
      return <CheckIcon className={className} {...props} />;
    default:
      return null;
  }
};
