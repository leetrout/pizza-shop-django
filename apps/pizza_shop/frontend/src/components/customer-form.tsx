import { Customer, customerSchema } from '@/lib/schemas';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { useCreateOrder, useGetOrCreateCustomer } from '@/lib/api';
import { LoadingButton } from './ui/loading-button';
import { useOrder } from '@/lib/use-order';
import { useOrderPizzaPrices, useOrderTotal } from '@/lib/use-pizza-price';

export const CustomerForm: FC = () => {
  const { order } = useOrder();
  const { mutate: getOrCreateCustomer, isPending: customerPending } =
    useGetOrCreateCustomer();
  const { mutate: createOrder, isPending: orderPending } = useCreateOrder();
  const form = useForm<Customer>({
    resolver: zodResolver(customerSchema.omit({ external_id: true })),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });
  const prices = useOrderPizzaPrices();
  const { data: total } = useOrderTotal();
  const onSubmit = (values: Customer) => {
    if (!order.pizzas || order.pizzas.length < 1) return;
    getOrCreateCustomer(values, {
      onSuccess: (customer) => {
        createOrder(
          {
            pizzas: order.pizzas!.map((p, i) => ({
              size: p.size.external_id,
              crust: p.crust.external_id,
              toppings: p.toppings.map((t) => t.external_id),
              price: prices[i].data?.toFixed(2) || '',
            })),
            customer_external_id: customer.external_id,
            method: order.method!,
            total_price: total?.toFixed(2) || '',
          },
          {
            onSuccess: (order) => {
              window.location.search = 'oid=' + order.external_id;
            },
          },
        );
      },
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isLoading={customerPending || orderPending}
          disabled={
            !order.pizzas || order.pizzas.length < 1 || !form.formState.isDirty
          }
        >
          Order now
        </LoadingButton>
      </form>
    </Form>
  );
};
