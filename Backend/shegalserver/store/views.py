from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer,OrderSerializer
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework import status
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from .models import Product, Order, OrderItem, Customer,ShippingAddress
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from .serializers import OrderItemSerializer
from rest_framework.permissions import AllowAny
from .utils import CsrfExemptSessionAuthentication
import cv2
import mediapipe as mp
import numpy as np
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication


from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def set_csrf_cookie(request):
    # Django automatically sets the 'csrftoken' cookie in the response headers.
    return JsonResponse({"status": "CSRF cookie ensured"})
@api_view(['GET'])
def search_products(request):
    # query = request.GET.get("q","")
    # products = Product.objects.all()

    # if query:
    #     products = products.filter(Q(name__icontains=query)|Q(description__icontains=query))
    # serializer = ProductSerializer(products, many=True)
    # return Response(serializer.data)

    search_query = request.query_params.get('search', '')
    
    # Filter products where name, brand, or category contains the search string
    products = Product.objects.all()
    
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) | 
            Q(brand__icontains=search_query) |
            Q(category__icontains=search_query)
        )
    
    # Simple pagination logic
    offset = int(request.query_params.get('offset', 0))
    limit = int(request.query_params.get('limit', 12))
    
    products_slice = products[offset : offset + limit]
    serializer = ProductSerializer(products_slice, many=True)
    return Response(serializer.data)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])  # Force JWT only for this API
def skin_analysis(request):
    file = request.FILES.get('image')
    if not file:
        return Response({"error": "No image uploaded"}, status=400)

    # 1. Image Decoding
    img_data = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_data, cv2.IMREAD_COLOR)
    if img is None:
        return Response({"error": "Invalid image format"}, status=400)

    h, w, _ = img.shape

    # 2. Face Detection (FaceMesh)
    mp_face = mp.solutions.face_mesh
    with mp_face.FaceMesh(static_image_mode=True, max_num_faces=1) as face_mesh:
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb)

    if not results.multi_face_landmarks:
        return Response({"error": "No face detected. Please ensure your face is visible."}, status=400)

    # 3. Extract ROI (Region of Interest) - Forehead and Cheeks
    # We focus on the "T-Zone" for oiliness detection
    xs, ys = [], []
    for lm in results.multi_face_landmarks[0].landmark:
        xs.append(int(lm.x * w))
        ys.append(int(lm.y * h))

    # Boundary Safety Checks
    x1, x2 = max(0, min(xs)), min(w, max(xs))
    y1, y2 = max(0, min(ys)), min(h, max(ys))
    face_crop = img[y1:y2, x1:x2]

    # 4. Advanced Analysis Logic
    # Convert to HSV to analyze Brightness (Value) and Saturation
    hsv = cv2.cvtColor(face_crop, cv2.COLOR_BGR2HSV)
    saturation = hsv[:,:,1].mean()  # Color intensity
    brightness = hsv[:,:,2].mean()  # Light reflection

    # Convert to LAB to analyze skin texture/dullness (A & B channels)
    lab = cv2.cvtColor(face_crop, cv2.COLOR_BGR2LAB)
    l_channel, a_channel, b_channel = cv2.split(lab)
    
    # Calculate Standard Deviation of L-channel (Texture roughness)
    # Higher std dev usually indicates dry/flaky skin texture
    texture_roughness = np.std(l_channel)

    # 5. Skin Type Classification Logic
    # Oily: High brightness (reflection) + high saturation
    # Dry: Low brightness + High texture roughness (flakiness)
    # Normal: Balanced values
    
    if brightness > 170 and saturation > 60:
        skin_type = "oily"
        recommendation = "Focus on oil-control cleansers and lightweight, non-comedogenic moisturizers."
    elif texture_roughness > 25 or brightness < 100:
        skin_type = "dry"
        recommendation = "Your skin needs deep hydration. Use cream-based cleansers and rich moisturizers with ceramides."
    else:
        skin_type = "normal"
        recommendation = "Your skin is well-balanced. Maintain it with a gentle cleanser and daily SPF."

    return Response({
        "skin_type": skin_type,
        "message": f"Analysis complete. Your skin appears to be {skin_type}.",
        "recommendation": recommendation,
        "metrics": {
            "brightness": float(brightness),
            "saturation": float(saturation),
            "texture": float(texture_roughness)
        }
    })

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    if not product_id:
        return Response({"error": "Product ID is required"}, status=400)

    # Get or create customer
    customer, created = Customer.objects.get_or_create(user=request.user, defaults={
        "name": request.user.username,
        "email": request.user.email
    })

    # Get or create order
    order, created = Order.objects.get_or_create(customer=customer, complete=False)

    # Get product
    product = get_object_or_404(Product, id=product_id)

    # Get or create order item
    order_item, created = OrderItem.objects.get_or_create(order=order, product=product)
    order_item.quantity += 1
    order_item.save()

    return Response({"message": "Product added to cart successfully", "cart_items": order.get_cart_items})

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    product_id = request.data.get('product_id')
    if not product_id:
        return Response({"error": "Product ID is required"}, status=400)

    # Get or create customer
    customer, created = Customer.objects.get_or_create(user=request.user, defaults={
        "name": request.user.username,
        "email": request.user.email
    })

    # Get or create order
    order, created = Order.objects.get_or_create(customer=customer, complete=False)

    # Get product
    product = get_object_or_404(Product, id=product_id)

    # Get or create order item
    order_item, created = OrderItem.objects.get_or_create(order=order, product=product)
    if order_item.quantity > 0:
        order_item.quantity -= 1
        if order_item.quantity > 0:
            order_item.save()
        else:
            order_item.delete()
        


    return Response({"message": "Product removed to cart successfully", "cart_items": order.get_cart_items})

@api_view(['GET'])
def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(['GET'])
def paginated_products(request):
    try:
        offset = int(request.query_params.get('offset', 0))
        limit = int(request.query_params.get('limit', 9))
    except ValueError:
        offset = 0
        limit = 9

    products = Product.objects.all()[offset:offset + limit]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def product_detail(request, id):
    try:
        product = Product.objects.get(pk=id)
    except Product.DoesNotExist:
        return Response(status=404)
    serializer = ProductSerializer(product)
    return Response(serializer.data)

class ProductListView(APIView):

    def get(self, request):
        search = request.query_params.get('search', '')
        offset = int(request.query_params.get('offset', 0))
        limit = int(request.query_params.get('limit', 9))
        # you can add category, price filters here as well

        products = Product.objects.all()

        if search:
            products = products.filter(name__icontains=search)

        # Add other filters similarly:
        # category = request.query_params.get('category')
        # if category:
        #     products = products.filter(category=category)

        total = products.count()

        products = products[offset:offset+limit]

        serializer = ProductSerializer(products, many=True, context={'request': request})

        return Response({
            'total': total,
            'count': len(serializer.data),
            'results': serializer.data
        }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cart_summary(request):
    customer = request.user.customer  # assuming you have a Customer linked to User
    # get the current incomplete order (cart)
    order, created = Order.objects.get_or_create(customer=customer, complete=False)
    
    orderitems = order.orderitem_set.all()
    
    items = []
    for item in orderitems:
        items.append({
            "id": item.product.id,
            "name": item.product.name,
            "price": item.product.price,
            "quantity": item.quantity,
            "image": request.build_absolute_uri(item.product.image.url) if item.product.image else None,
        })

    return Response({
        "items": items,
        "cart_items": order.get_cart_items,
        "cart_total": order.get_cart_total
    })



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cart_detail(request):
    customer, _ = Customer.objects.get_or_create(
        user=request.user,
        defaults={"name": request.user.username, "email": request.user.email}
    )
    order, _ = Order.objects.get_or_create(customer=customer, complete=False)
    serializer = OrderSerializer(order, context={'request': request})
    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_shipping_address(request):
    user = request.user   

    try:
        customer, created = Customer.objects.get_or_create(
            user=user,
            defaults={"name": user.username, "email": user.email}
        )

        data = request.data

        orders = Order.objects.filter(customer=customer, complete=False)

        if not orders.exists():
            return Response(
                {"error": "No active order found for this customer."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        shipping_addresses = []

        for order in orders:
            shipping = ShippingAddress.objects.create(
                customer=customer,
                order=order,
                address=data.get("address"),
                city=data.get("city"),
                state=data.get("state"),
                ward=data.get("ward"),
                street=data.get("street"),
            )
            shipping_addresses.append({
                "order_id": order.id,
                "shipping_id": shipping.id,
                "address": shipping.address,
                "city": shipping.city,
                "state": shipping.state,
                "ward": shipping.ward,
                "street": shipping.street,
            })

        return Response({
            "message": "Shipping address saved successfully!",
            "customer": customer.name,
            "addresses": shipping_addresses,
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
