# urls.py
from django.urls import path
from .views import paginated_products
from .views import product_detail
from .views import ProductListView
from .views import add_to_cart,remove_from_cart,cart_summary,cart_detail,add_shipping_address,skin_analysis,search_products,order_summary, ConfirmOrderView
from .views import ForgotPasswordView,ResetPasswordView
urlpatterns = [
    path('products/', paginated_products, name='first_nine_products'),
    path('products/<int:id>/',product_detail, name='product-detail'),
    path('products/search/', ProductListView.as_view(), name='product-list'),
    path('add-to-cart/',add_to_cart,name="AddToCart"),
    path('remove_from-cart/',remove_from_cart,name="RemoveFromCart"),
    path('cart-summary/', cart_summary, name='cart-summary'),
    path('order-summary/', order_summary.as_view(), name='order-summary'),
    path('cart/',cart_detail, name='cart'),
    path('ship/',add_shipping_address, name='ship'),  
    path('skin-analysis/',skin_analysis,name="skincare"),  
    path('search/',search_products,name="search products"),
    path('api/confirm-order/', ConfirmOrderView.as_view(), name='confirm-order'),
    path("api/forgot-password/", ForgotPasswordView.as_view(),name='forgot-password'),
    path("api/reset-password/", ResetPasswordView,name='reset-password'),

]
