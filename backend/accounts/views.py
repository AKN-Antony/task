from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer, UserSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegistrationSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class RequestPasswordResetView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        # Mocked password reset logic
        email = request.data.get('email')
        if email:
            # Here you would typically generate a token and send an email
            return Response({"detail": "Password reset email sent (mocked)."}, status=status.HTTP_200_OK)
        return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
