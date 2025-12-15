from urllib.parse import parse_qs
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model
from channels.middleware import BaseMiddleware

User = get_user_model()

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

class TokenAuthMiddlewareStack(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        headers = dict(scope['headers'])
        cookies = {}
        if b'cookie' in headers:
            cookie_header = headers[b'cookie'].decode()
            for kv in cookie_header.split(';'):
                if '=' in kv:
                    k, v = kv.strip().split('=', 1)
                    cookies[k] = v

        access_token = cookies.get('access_token')

        if access_token:
            try:
                validated_token = UntypedToken(access_token)
                user_id = validated_token['user_id']
                scope['user'] = await get_user(user_id)
            except (InvalidToken, TokenError):
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)
