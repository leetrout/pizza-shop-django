from django.core.exceptions import ValidationError
from django.db import models
from ulid import ULID

from . import data


class PrefixedULIDField(models.CharField):
    def __init__(self, prefix, *args, **kwargs):
        self.prefix = prefix
        kwargs["max_length"] = len(prefix) + 27  # prefix + '-' + 26 char ULID
        kwargs["unique"] = True
        kwargs["editable"] = False
        super().__init__(*args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        kwargs["prefix"] = self.prefix
        return name, path, args, kwargs

    def pre_save(self, model_instance, add):
        if add and not getattr(model_instance, self.attname):
            value = f"{self.prefix}-{str(ULID())}"
            setattr(model_instance, self.attname, value)
            return value
        else:
            return super().pre_save(model_instance, add)


class Customer(models.Model):
    external_id = PrefixedULIDField(prefix="cust", db_index=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name + self.email


class Topping(models.Model):
    external_id = PrefixedULIDField(prefix="top", db_index=True)
    name = models.CharField(max_length=50, unique=True)
    price = models.DecimalField(max_digits=4, decimal_places=2)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} (${self.price})"


class Crust(models.Model):
    external_id = PrefixedULIDField(prefix="cru", db_index=True)
    name = models.CharField(max_length=50, unique=True)
    price = models.DecimalField(max_digits=4, decimal_places=2)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Size(models.Model):
    external_id = PrefixedULIDField(prefix="sz", db_index=True)
    name = models.CharField(max_length=50, unique=True)
    price_modifier = models.DecimalField(max_digits=4, decimal_places=2)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Pizza(models.Model):
    external_id = PrefixedULIDField(prefix="piz", db_index=True)
    size = models.ForeignKey(Size, on_delete=models.CASCADE)
    toppings = models.ManyToManyField(Topping)
    crust = models.ForeignKey(Crust, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.size.name} {self.crust.name} pizza"


class Order(models.Model):
    STATUS_CHOICES = data.ORDER_STATUS_CHOICES
    METHOD_CHOICES = data.DELIVERY_METHOD_CHOICES

    external_id = PrefixedULIDField(prefix="ord", db_index=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    pizzas = models.ManyToManyField(Pizza)
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(
        max_length=20, choices=data.ORDER_STATUS_CHOICES, default="pending"
    )
    notes = models.TextField(blank=True, null=True)
    method = models.CharField(
        max_length=10, choices=data.DELIVERY_METHOD_CHOICES, default="pickup"
    )
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - {self.customer.name}"

    def clean(self):
        if self.status == "On the way" and self.method != "delivery":
            raise ValidationError(
                "'On the way' status can only be set for delivery orders."
            )
        if self.status == "Ready for pickup" and self.method != "pickup":
            raise ValidationError(
                "'Ready for pickup' status can only be set for pickup orders."
            )
        if self.status not in [status[0] for status in self.STATUS_CHOICES]:
            raise ValidationError(f"Invalid status: {self.status}")
        if not self.status:
            self.status = "pending"

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class Payment(models.Model):
    external_id = PrefixedULIDField(prefix="pay", db_index=True)
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    transaction_id = models.CharField(max_length=100, unique=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment for Order {self.order.id}"
