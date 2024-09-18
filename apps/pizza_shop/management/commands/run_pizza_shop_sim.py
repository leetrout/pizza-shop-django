import time

import sentry_sdk
from django.core.management.base import BaseCommand, CommandError

from apps.pizza_shop.models import Order
from apps.pizza_shop.tasks import simulate_pizza_shop


class Command(BaseCommand):
    help = "Simulate the pizza shop"

    def add_arguments(self, parser):
        parser.add_argument("--interval", type=int, default=1)

    def handle(self, *args, **options):
        interval = options["interval"]
        self.stdout.write("Starting pizza shop simulation")
        try:
            while True:
                orders = Order.objects.exclude(status="complete")
                self.stdout.write(f"Simulating orders: {orders.count()}")
                simulate_pizza_shop(orders)
                time.sleep(interval)

        except KeyboardInterrupt:
            self.stdout.write("Stopping pizza shop simulation")
            sentry_sdk.get_client().flush()
