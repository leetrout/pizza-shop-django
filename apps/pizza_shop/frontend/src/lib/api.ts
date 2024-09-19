import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import axios from 'axios';
import {
  Crust,
  crustSchema,
  Customer,
  customerSchema,
  Method,
  Order,
  orderSchema,
  PizzaSize,
  sizeSchema,
  Topping,
  toppingSchema,
} from './schemas';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8000/api';

type Endpoint = '/toppings' | '/crusts' | '/customers' | '/sizes' | '/orders';

export const apiUrl = (
  endpointPath: Endpoint,
  opts?: { pathParams?: string[]; queryParams?: Record<string, string> },
): string => {
  return (
    `${API_URL}${endpointPath}/` +
    (opts?.pathParams ? opts.pathParams.join('/') : '') +
    (opts?.queryParams
      ? '?' +
        Object.entries(opts.queryParams)
          .map((entry) => entry.join('='))
          .join('&')
      : '')
  );
};

const makeResponseListSchema = <T extends z.ZodTypeAny>(itemSchema: T) => {
  return z.object({
    next: z.nullable(z.string().url()),
    previous: z.nullable(z.string().url()),
    results: z.array(itemSchema),
  });
};

export const useToppings = () =>
  useQuery({
    queryKey: ['toppings'],
    queryFn: async (): Promise<Topping[]> =>
      axios
        .get(apiUrl('/toppings'))
        .then(
          (res) =>
            makeResponseListSchema(toppingSchema).parse(res.data).results,
        ),
  });

export const useCrusts = () =>
  useQuery({
    queryKey: ['crusts'],
    queryFn: async (): Promise<Crust[]> =>
      axios
        .get(apiUrl('/crusts'))
        .then(
          (res) => makeResponseListSchema(crustSchema).parse(res.data).results,
        ),
  });

export const useSizes = () =>
  useQuery({
    queryKey: ['sizes'],
    queryFn: async (): Promise<PizzaSize[]> =>
      axios
        .get(apiUrl('/sizes'))
        .then(
          (res) => makeResponseListSchema(sizeSchema).parse(res.data).results,
        ),
  });

export const useOrderOptions = (opts: {
  externalId?: string;
  withPolling?: boolean;
}) => {
  return queryOptions({
    queryKey: ['order', opts.externalId],
    // FIXME: add method to api result
    queryFn: async (): Promise<Omit<Order, 'method'>> =>
      axios
        .get(apiUrl('/orders', { pathParams: [opts.externalId!] }))
        .then((res) => {
          return orderSchema.omit({ method: true }).parse(res.data);
        }),
    enabled: !!opts.externalId,
    refetchInterval: opts.withPolling ? 5000 : false,
  });
};

type OrderToCreate = {
  pizzas: { size: string; crust: string; toppings: string[]; price: string }[];
  customer_external_id: string;
  method: Method;
  total_price: string;
};

export const useCreateOrder = () =>
  useMutation({
    mutationKey: ['order'],
    mutationFn: async (
      order: OrderToCreate,
    ): Promise<Pick<Order, 'external_id'>> => {
      return axios
        .post(apiUrl('/orders'), order)
        .then((res) => orderSchema.pick({ external_id: true }).parse(res.data));
    },
  });

export const useGetOrCreateCustomer = () =>
  useMutation({
    mutationKey: ['customer'],
    mutationFn: async (customer: Customer): Promise<Customer> => {
      const customers = await axios
        .get(apiUrl('/customers', { queryParams: { email: customer.email } }))
        .then(
          (res) =>
            makeResponseListSchema(customerSchema).parse(res.data).results,
        );
      if (customers.length >= 1) {
        return customers[0];
      }
      return axios
        .post(apiUrl('/customers'), customer)
        .then((res) => customerSchema.parse(res.data));
    },
  });
