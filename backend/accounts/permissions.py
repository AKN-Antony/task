from rest_framework import permissions
from .models import Role

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == Role.ADMIN)

class IsManagerOrAdmin(permissions.BasePermission):
    """
    Allows access to Managers and Admins.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in [Role.ADMIN, Role.MANAGER])

class IsMemberOrHigher(permissions.BasePermission):
    """
    Allows access to Members, Managers, and Admins (excludes Viewer).
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in [Role.ADMIN, Role.MANAGER, Role.MEMBER])

class IsInSameOrganization(permissions.BasePermission):
    """
    Object-level permission to only allow access if the object's organization matches the user's.
    Requires the model to have an 'organization' attribute.
    """
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        if request.user.role == Role.ADMIN:
            return True
        return hasattr(obj, 'organization') and obj.organization == request.user.organization
