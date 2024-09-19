from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CrustViewSet,
    CustomerViewSet,
    OrderViewSet,
    PaymentViewSet,
    PizzaViewSet,
    SizeViewSet,
    ToppingViewSet,
)

router = DefaultRouter()
router.register(r"customers", CustomerViewSet)
router.register(r"toppings", ToppingViewSet)
router.register(r"pizzas", PizzaViewSet)
router.register(r"orders", OrderViewSet)
router.register(r"payments", PaymentViewSet)
router.register(r"crusts", CrustViewSet)
router.register(r"sizes", SizeViewSet)
