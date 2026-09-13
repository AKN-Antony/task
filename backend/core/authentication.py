from django.utils import timezone
from rest_framework import authentication
from rest_framework import exceptions
from accounts.models import APIKey

class APIKeyAuthentication(authentication.BaseAuthentication):
    """
    Custom authentication class for external integrations using API Keys.
    Clients should send the key in the Authorization header:
    Authorization: Api-Key <your_key_here>
    """
    keyword = 'Api-Key'

    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        
        if not auth_header:
            return None
            
        try:
            prefix, key = auth_header.split()
            if prefix != self.keyword:
                return None
        except ValueError:
            return None

        try:
            api_key = APIKey.objects.get(key=key, is_active=True)
        except APIKey.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid or inactive API Key.')

        # Update last used timestamp
        api_key.last_used_at = timezone.now()
        api_key.save(update_fields=['last_used_at'])

        # We return the user who created the API key to act on their behalf
        return (api_key.created_by, api_key)
