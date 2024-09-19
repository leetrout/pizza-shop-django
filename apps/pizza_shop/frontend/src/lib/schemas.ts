import z from 'zod';

export const sizeNameSchema = z.enum([
  'Small',
  'Medium',
  'Large',
  'Extra Large',
]);
export type PizzaSizeName = z.infer<typeof sizeNameSchema>;

export const sizeSchema = z.object({
  external_id: z.string(),
  name: sizeNameSchema,
  price_modifier: z.coerce.number(),
});
export type PizzaSize = z.infer<typeof sizeSchema>;

export const crustTypeSchema = z.enum(['Regular', 'Thin', 'Thick', 'Stuffed']);
export type CrustType = z.infer<typeof crustTypeSchema>;

export const crustSchema = z.object({
  external_id: z.string(),
  name: crustTypeSchema,
  price: z.coerce.number(),
});
export type Crust = z.infer<typeof crustSchema>;

export const toppingSchema = z.object({
  external_id: z.string(),
  name: z.string(),
  price: z.coerce.number(),
});
export type Topping = z.infer<typeof toppingSchema>;

export const pizzaSchema = z.object({
  size: sizeSchema,
  crust: crustSchema,
  toppings: z.array(toppingSchema),
});
export type Pizza = z.infer<typeof pizzaSchema>;

export const customerSchema = z.object({
  external_id: z.string(),
  name: z.string().min(3, { message: 'Name is too short' }),
  phone: z.string().length(10, { message: 'Invalid phone number' }),
  email: z.string().email(),
});
export type Customer = z.infer<typeof customerSchema>;

export const methodSchema = z.enum(['delivery', 'pickup']);
export type Method = z.infer<typeof methodSchema>;

export const orderStatusSchema = z.enum([
  'pending',
  'making',
  'baking',
  'on_the_way',
  'ready_for_pickup',
  'complete',
]);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const orderSchema = z.object({
  external_id: z.string(),
  pizzas: z.array(pizzaSchema),
  method: methodSchema,
  customer: customerSchema,
  status: orderStatusSchema,
});
export type Order = z.infer<typeof orderSchema>;
