# serializers.py
from rest_framework import serializers
from .models import Product, Order,OrderItem,ShippingAddress

from .models import ConfirmedOrder
from .models import ConfirmedOrderItem

class ConfirmedOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfirmedOrderItem
        fields = ['product_name', 'price_at_purchase', 'quantity', 'get_total']

class ConfirmedOrderSerializer(serializers.ModelSerializer):
    # We use 'items' because we set related_name='items' in the model
    items = ConfirmedOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = ConfirmedOrder
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ShipSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'line_total']

    def get_line_total(self, obj):
        return obj.quantity * (obj.product.price if obj.product else 0)

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(source='orderitem_set', many=True)
    cart_items = serializers.SerializerMethodField()
    cart_total = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'complete', 'date_ordered', 'items', 'cart_items', 'cart_total']

    def get_cart_items(self, obj):
        return obj.get_cart_items

    def get_cart_total(self, obj):
        return obj.get_cart_total