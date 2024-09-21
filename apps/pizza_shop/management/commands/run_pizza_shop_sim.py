import time

import sentry_sdk
from django.core.management.base import BaseCommand, CommandError

from apps.pizza_shop.models import Order
from apps.pizza_shop.tasks import simulate_pizza_shop


@sentry_sdk.trace
def process_orders(orders):
    simulate_pizza_shop(orders)


class Command(BaseCommand):
    help = "Simulate the pizza shop"

    def add_arguments(self, parser):
        parser.add_argument("--interval", type=int, default=1)

    def handle(self, *args, **options):
        interval = options["interval"]
        self.stdout.write("Starting pizza shop simulation")
        try:
            while True:
                with sentry_sdk.start_transaction(
                    op="task", name="Run Pizza Shop Simulation"
                ):
                    sentry_sdk.api.set_context(
                        "ctx_example", {"example_ctx": "example"}
                    )
                    sentry_sdk.api.set_tag("tag_example", "example")
                    sentry_sdk.api.set_extra(
                        "extra_example", {"example_extra": "example"}
                    )
                    orders = Order.objects.exclude(status="complete")
                    self.stdout.write(f"Simulating orders: {orders.count()}")
                    process_orders(orders)
                time.sleep(interval)

        except KeyboardInterrupt:
            self.stdout.write("Stopping pizza shop simulation")
            sentry_sdk.get_client().flush()
