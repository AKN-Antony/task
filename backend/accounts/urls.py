from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, UserProfileView, RequestPasswordResetView

urlpatterns = [
    # Auth JWT
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Users
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/password-reset/', RequestPasswordResetView.as_view(), name='auth_password_reset'),
    path('users/me/', UserProfileView.as_view(), name='user_profile_me'),
]
