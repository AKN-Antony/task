from django.contrib import admin
from django.urls import path, re_path, include
from django.http import JsonResponse
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

def health_check(request):
    return JsonResponse({"status": "healthy", "message": "Backend is running!"})

schema_view = get_schema_view(
    openapi.Info(
        title="Automated Task Management API",
        default_version='v1',
        description="API documentation for Phase 1",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    # Health check
    path('api/v1/health/', health_check, name='health_check'),
    # API Documentation
    re_path(r'^api/v1/docs/swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('api/v1/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/v1/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
