import { ComponentProps, FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CustomerForm } from './customer-form';

export const CustomerInfoCard: FC<ComponentProps<'div'>> = (props) => {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Your details</CardTitle>
      </CardHeader>
      <CardContent>
        <CustomerForm />
      </CardContent>
    </Card>
  );
};
