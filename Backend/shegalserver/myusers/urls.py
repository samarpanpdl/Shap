from django.urls import path
from .views import register_user,login_user,get_user_info
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('api/register/', register_user),
    path('api/login/', login_user), 
    path('api/user-info/', get_user_info),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
