# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny
from email_validator import validate_email, EmailNotValidError

def verify_email_domain(email):
    correct = True
    try:
        # check_deliverability=True actually looks up the DNS
        valid = validate_email(email, check_deliverability=True)
        return True # Returns normalized email
    except EmailNotValidError as e:
        # This will catch 'gmaill.comm' because that domain doesn't exist
        return False
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    phone_number = request.data.get('phone_number')
    address = request.data.get('address')

    if not username or not email or not password:
        return Response({'message': 'Username, email, and password are required'}, status=400)

    if not verify_email_domain(email):
        return Response({'message': 'Invalid email address or domain does not exist'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'message': 'Username already taken'}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({'message': 'Email already registered'}, status=400)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
    )

    # Create profile if needed
    profile = getattr(user, 'profile', None)
    if not profile:
        from .models import Profile
        profile = Profile.objects.create(user=user)

    def to_str(value):
        return str(value) if value is not None else None

    profile.phone_number = to_str(phone_number)
    profile.address = to_str(address)
    profile.save()

    return Response({'message': 'User and profile registered successfully'}, status=201)



@api_view(['POST'])
def login_user(request):
    
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        return Response({'message': 'Login successful'}, status=200)
    else:
        return Response({'message': 'Invalid username or password'}, status=401)

@api_view(['GET'])  
@permission_classes([IsAuthenticated])
def get_user_info(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
