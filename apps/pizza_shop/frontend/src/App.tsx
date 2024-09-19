import { ColorWheelIcon } from '@radix-ui/react-icons';
import { QueryProvider } from './components/query-provider';
import { OrderProvider } from './lib/order-provider';
import { PizzaMenu } from './components/pizza-menu';
import { CreatePizzaButton } from './components/create-pizza-button';
import { PizzaWizard } from './components/pizza-wizard';
import { OrderSummaryCard } from './components/order-summary';
import { MethodSwitch } from './components/method-switch';
import { CustomerInfoCard } from './components/customer-info-card';
import { OrderStatusDialog } from './components/order-status-dialog';

function App() {
  return (
    <QueryProvider>
      <header className="py-2 flex items-center justify-between border-b">
        <div className="container px-8 mx-auto">
          <div className="flex items-center gap-2 text-xl text-primary">
            <ColorWheelIcon className="w-8 h-8" />
            Antonio's Pizza
          </div>
        </div>
      </header>
      <OrderProvider>
        <OrderStatusDialog />
        <main className="container antialiased mx-auto px-8 py-8 flex flex-col gap-8">
          <section className="border-l px-4 py-2 flex items-center justify-between">
            <div>
              <h1 className="text-4xl">Welcome to Antonio's!</h1>
              <p className="text-lg">
                Create your own pizza or choose from our menu.
              </p>
            </div>
            <MethodSwitch />
          </section>
          <section className="flex flex-col gap-2">
            <PizzaMenu className="w-full" />
            <CreatePizzaButton className="w-full" />
          </section>
          <PizzaWizard />
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OrderSummaryCard />
            <CustomerInfoCard />
          </section>
        </main>
      </OrderProvider>
    </QueryProvider>
  );
}

export default App;
