PIZZA_SIZE_CHOICES = [
    ("small", "Small"),
    ("medium", "Medium"),
    ("large", "Large"),
    ("extra_large", "Extra Large"),
]

PIZZA_SIZES = [x[0] for x in PIZZA_SIZE_CHOICES]

DELIVERY_METHOD_CHOICES = [
    ("pickup", "Pickup"),
    ("delivery", "Delivery"),
]

DELIVERY_METHODS = [x[0] for x in DELIVERY_METHOD_CHOICES]

ORDER_STATUS_CHOICES = [
    ("pending", "Pending"),
    ("making", "Making"),
    ("baking", "Baking"),
    ("on_the_way", "On the way"),
    ("ready_for_pickup", "Ready for pickup"),
    ("complete", "Complete"),
]

ORDER_STATUSES = [x[0] for x in ORDER_STATUS_CHOICES]

ORDER_TRANSITIONS_DELIVERY = {
    "pending": "making",
    "making": "baking",
    "baking": "on_the_way",
    "on_the_way": "complete",
}

ORDER_TRANSITIONS_PICKUP = {
    "pending": "making",
    "making": "baking",
    "baking": "ready_for_pickup",
    "ready_for_pickup": "complete",
}

ORDER_TRANSITIONS = {
    "delivery": ORDER_TRANSITIONS_DELIVERY,
    "pickup": ORDER_TRANSITIONS_PICKUP,
}
