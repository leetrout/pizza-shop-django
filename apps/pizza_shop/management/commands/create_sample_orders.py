import random
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import IntegrityError
from faker import Faker

from apps.pizza_shop.models import Crust, Customer, Order, Pizza, Size, Topping

fake = Faker()


class Command(BaseCommand):
    help = "Creates sample data for the pizza shop"

    def add_arguments(self, parser):
        parser.add_argument("customers", type=int, help="Number of customers to create")
        parser.add_argument("orders", type=int, help="Number of orders to create")

    def handle(self, *args, **options):
        num_customers = options["customers"]
        num_orders = options["orders"]

        self.create_customers(num_customers)

        customer_choices = list(Customer.objects.all())

        self.create_orders(num_orders, customer_choices)

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully created {num_customers} customers and {num_orders} orders"
            )
        )

    def create_customers(self, num_customers):
        customers = []
        for _ in range(num_customers):
            try:
                customer = Customer.objects.create(
                    name=fake.name(), email=fake.email(), phone=fake.phone_number()
                )
            except IntegrityError:
                self.stdout.write(
                    self.style.WARNING(
                        f"Customer {fake.name()} already exists, skipping..."
                    )
                )
            customers.append(customer)
        return customers

    def create_orders(self, num_orders, customers):
        toppings = list(Topping.objects.all())
        crusts = list(Crust.objects.all())
        sizes = list(Size.objects.all())
        for _ in range(num_orders):
            customer = random.choice(customers)
            method = random.choice([method[0] for method in Order.METHOD_CHOICES])

            # Ensure 'Ready for pickup' status is only used for pickup orders
            # and 'On the way' status is only used for delivery orders
            if method == "pickup":
                status_choices = [
                    status[0]
                    for status in Order.STATUS_CHOICES
                    if status[0] != "on_the_way"
                ]
            else:  # delivery
                status_choices = [
                    status[0]
                    for status in Order.STATUS_CHOICES
                    if status[0] != "ready_for_pickup"
                ]

            order = Order.objects.create(
                customer=customer,
                total_price=Decimal("0"),
                status=random.choice(status_choices),
                method=method,
                notes=fake.text(max_nb_chars=100)
                if random.choice([True, False])
                else "",
            )

            num_pizzas = random.randint(1, 3)
            total_price = Decimal("0")

            for _ in range(num_pizzas):
                pizza = Pizza.objects.create(
                    size=random.choice(sizes),
                    crust=random.choice(crusts),
                    price=Decimal("0"),  # We'll calculate this after adding toppings
                )

                num_toppings = random.randint(1, 5)
                pizza_toppings = random.sample(toppings, num_toppings)
                pizza.toppings.set(pizza_toppings)

                # Calculate pizza price
                base_price = Decimal("10")  # Base price for a pizza
                topping_price = sum(topping.price for topping in pizza_toppings)
                size_modifier = pizza.size.price_modifier
                pizza.price = (
                    base_price + topping_price + pizza.crust.price
                ) * size_modifier
                pizza.save()

                order.pizzas.add(pizza)
                total_price += pizza.price

            order.total_price = total_price
            order.save()
