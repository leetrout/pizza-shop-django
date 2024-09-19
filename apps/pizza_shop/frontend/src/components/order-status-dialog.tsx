import { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { OrderStatusIndicator } from './order-status-indicator';
import { Skeleton } from './ui/skeleton';
import { ValueNoneIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { useOrderOptions } from '@/lib/api';

export const OrderStatusDialog: FC = () => {
  // grab search params:
  const searchParams = new URLSearchParams(window.location.search);
  const orderId = searchParams.get('oid');
  const { data: order, isLoading } = useQuery(
    useOrderOptions({ externalId: orderId || undefined, withPolling: true }),
  );
  return (
    <Dialog defaultOpen={!!orderId}>
      <DialogContent className="antialiased">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Antonio will take it from here...
          </DialogTitle>
          <DialogDescription>
            Thanks, {order?.customer.name.split(' ')[0]}! Your order is in good
            hands now. Check status below:
          </DialogDescription>
        </DialogHeader>
        <div className="w-full h-full flex items-center justify-center p-8">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : !order ? (
            <ValueNoneIcon />
          ) : (
            <OrderStatusIndicator status={order.status} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
