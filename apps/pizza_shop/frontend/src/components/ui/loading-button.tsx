import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ColorWheelIcon } from '@radix-ui/react-icons';
import { FC } from 'react';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export const LoadingButton: FC<LoadingButtonProps> = ({
  isLoading,
  children,
  ...props
}) => {
  return (
    <Button disabled={isLoading || props.disabled} {...props}>
      {' '}
      <div className="relative w-full h-full flex justify-center items-center">
        {isLoading && (
          <ColorWheelIcon className="w-full h-full animate-spin absolute inset-0 " />
        )}
        <div className={cn(isLoading && 'invisible')}>{children}</div>
      </div>
    </Button>
  );
};
