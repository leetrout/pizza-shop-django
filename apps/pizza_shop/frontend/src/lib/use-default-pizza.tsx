import { useCrusts, useSizes } from './api';
import { Pizza } from './schemas';

export const useDefaultPizza = (): { pizza?: Pizza; isLoading: boolean } => {
  const { data: sizes, isLoading: sizesLoading } = useSizes();
  const { data: crusts, isLoading: crustsLoading } = useCrusts();
  if (sizesLoading || crustsLoading) {
    return {
      isLoading: true,
    };
  }
  return {
    pizza: {
      size: sizes!.find((s) => s.name === 'Large')!,
      crust: crusts!.find((c) => c.name === 'Regular')!,
      toppings: [],
    },
    isLoading: false,
  };
};
