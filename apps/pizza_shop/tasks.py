import datetime
import random
import time

from django.utils import timezone

from .data import ORDER_TRANSITIONS
from .models import Order

state_timing_seconds = {
    "pending": 5,
    "making": 10,
    "baking": 30,
    "on_the_way": 30,
    "ready_for_pickup": 10,
}


def get_order_transition_time(order, state_timing_map=None):
    if order.status not in state_timing_map:
        # TODO: Track this metric
        return

    delay_secs = state_timing_map[order.status]
    return order.date_updated + datetime.timedelta(seconds=delay_secs)


def simulate_pizza_shop(orders=None, state_timing_map=None):
    """Moves orders through the system"""
    if state_timing_map is None:
        state_timing_map = state_timing_seconds

    if orders is None:
        orders = Order.objects.all()

    now = timezone.now()

    for order in orders:
        transition_time = get_order_transition_time(order, state_timing_map)

        if transition_time > now:
            print(f"Order {order.id} will transition at {transition_time}")
            continue

        old_status = order.status
        order.status = ORDER_TRANSITIONS[order.method][order.status]
        order.save()

        print(f"Order {order.id} transitioned from {old_status} to {order.status}")
