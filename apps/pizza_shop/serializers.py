from decimal import Decimal

from django.db import IntegrityError, transaction
from rest_framework import serializers

from .data import BASE_PIZZA_PRICE, DELIVERY_PRICE
from .models import Crust, Customer, Order, Payment, Pizza, Size, Topping


class CrustSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crust
        fields = ["external_id", "name", "price", "date_created", "date_updated"]


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            "external_id",
            "name",
            "email",
            "phone",
            "date_created",
            "date_updated",
        ]


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = [
            "external_id",
            "name",
            "price_modifier",
            "date_created",
            "date_updated",
        ]


class CustomerCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["name", "email", "phone"]


class ToppingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topping
        fields = ["external_id", "name", "price", "date_created", "date_updated"]


class PizzaSerializer(serializers.ModelSerializer):
    toppings = ToppingSerializer(many=True, read_only=True)
    size = SizeSerializer(read_only=True)
    crust = CrustSerializer(read_only=True)

    class Meta:
        model = Pizza
        fields = [
            "external_id",
            "size",
            "toppings",
            "crust",
            "price",
            "date_created",
            "date_updated",
        ]


class PizzaCreateSerializer(serializers.ModelSerializer):
    toppings = serializers.SlugRelatedField(
        queryset=Topping.objects.all(), slug_field="external_id", many=True
    )
    crust = serializers.SlugRelatedField(
        queryset=Crust.objects.all(), slug_field="external_id"
    )
    size = serializers.SlugRelatedField(
        queryset=Size.objects.all(), slug_field="external_id"
    )

    class Meta:
        model = Pizza
        fields = ["size", "toppings", "crust", "price"]


class OrderCreateSerializer(serializers.ModelSerializer):
    customer_external_id = serializers.CharField(max_length=100, required=False)
    customer = CustomerCreateSerializer(required=False)
    pizzas = PizzaCreateSerializer(many=True)
    total_price = serializers.DecimalField(
        max_digits=8, decimal_places=2, required=False
    )
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES, default="pending")
    notes = serializers.CharField(required=False, allow_blank=True)
    method = serializers.ChoiceField(choices=Order.METHOD_CHOICES, default="pickup")

    class Meta:
        model = Order
        fields = [
            "external_id",
            "customer_external_id",
            "customer",
            "pizzas",
            "total_price",
            "status",
            "notes",
            "method",
        ]

    def validate(self, data):
        if "customer_external_id" not in data and "customer" not in data:
            raise serializers.ValidationError(
                "Either customer_external_id or customer details must be provided."
            )
        if "total_price" not in data:
            raise serializers.ValidationError("Total price is required.")

        total_price = 0
        if data["method"] == "delivery":
            total_price += DELIVERY_PRICE
        for pizza_data in data["pizzas"]:
            pizza_price = BASE_PIZZA_PRICE
            for topping in pizza_data["toppings"]:
                pizza_price += topping.price
            pizza_price += pizza_data["crust"].price
            pizza_price *= pizza_data["size"].price_modifier
            total_price += Decimal(pizza_price).quantize(Decimal("1.00"))

        if total_price != data["total_price"]:
            print(
                f"Total price: {total_price}, data total price: {data['total_price']}"
            )
            raise serializers.ValidationError(
                "Total price does not match the sum of pizza prices."
            )
        return data

    def create(self, validated_data):
        with transaction.atomic() as tx:
            customer_external_id = validated_data.pop("customer_external_id", None)
            customer_data = validated_data.pop("customer", None)
            pizzas_data = validated_data.pop("pizzas")

            if customer_external_id:
                try:
                    customer = Customer.objects.get(external_id=customer_external_id)
                except Customer.DoesNotExist:
                    raise serializers.ValidationError("Customer not found.")
            elif customer_data:
                customer, _ = Customer.objects.get_or_create(
                    email=customer_data["email"],
                    defaults={
                        "name": customer_data["name"],
                        "phone": customer_data["phone"],
                    },
                )
            else:
                raise serializers.ValidationError("Customer information is required.")

            try:
                order = Order.objects.create(customer=customer, **validated_data)
            except IntegrityError as e:
                raise serializers.ValidationError("Integrity error")

            for pizza_data in pizzas_data:
                toppings_data = pizza_data.pop("toppings")
                pizza = Pizza.objects.create(**pizza_data)
                for topping in toppings_data:
                    # topping = Topping.objects.get(external_id=topping_external_id)
                    pizza.toppings.add(topping)
                order.pizzas.add(pizza)

            order.save()

            return order


class OrderSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    pizzas = PizzaSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "external_id",
            "customer",
            "pizzas",
            "total_price",
            "status",
            "date_created",
            "date_updated",
        ]


class PaymentSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = [
            "external_id",
            "order",
            "amount",
            "payment_method",
            "transaction_id",
            "date_created",
            "date_updated",
        ]
