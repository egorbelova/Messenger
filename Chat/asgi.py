import os
from Site.consumers import ChatConsumer
from django.urls import re_path
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from Site.middleware import TokenAuthMiddlewareStack

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Chat.settings")

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": TokenAuthMiddlewareStack(
            URLRouter(
                [
                    re_path(
                        r"socket-server/(?P<user_id>\w+)/$", ChatConsumer.as_asgi()
                    ),
                ]
            )
        ),
    }
)
