from rest_framework.routers import DefaultRouter
from .views import PostViewSet, FollowViewSet
router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'follows', FollowViewSet, basename='follow')
urlpatterns = router.urls