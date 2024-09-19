from django.contrib import admin

# Register your models here.
from .models import Crust, Customer, Order, Payment, Pizza, Size, Topping


class OrderAdmin(admin.ModelAdmin):
    list_display = ("external_id", "customer", "status", "total_price", "date_created")
    list_filter = ("status",)
    search_fields = ("external_id", "customer__name")


admin.site.register(Crust)
admin.site.register(Customer)
admin.site.register(Order, OrderAdmin)
admin.site.register(Payment)
admin.site.register(Pizza)
admin.site.register(Size)
admin.site.register(Topping)
