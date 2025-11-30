from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Post, Comment, Follow, PostLike
from .serializers import PostSerializer, CommentSerializer, FollowSerializer

class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.method in permissions.SAFE_METHODS or getattr(obj, 'author', None) == request.user

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.select_related('author').prefetch_related('comments', 'postlike_set').order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrReadOnly]
    def perform_create(self, serializer): serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        PostLike.objects.get_or_create(user=request.user, post=self.get_object())
        return Response({'liked': True})

    @action(detail=True, methods=['post'])
    def unlike(self, request, pk=None):
        PostLike.objects.filter(user=request.user, post=self.get_object()).delete()
        return Response({'liked': False})

    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        body = request.data.get('body','').strip()
        if not body: return Response({'detail': 'Comment body required'}, status=400)
        c = Comment.objects.create(author=request.user, post=self.get_object(), body=body)
        return Response(CommentSerializer(c).data, status=status.HTTP_201_CREATED)

class FollowViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.select_related('follower','following').order_by('-created_at')
    serializer_class = FollowSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        target_id = request.data.get('user_id')
        if not target_id or int(target_id) == request.user.id:
            return Response({'detail': 'Invalid follow target'}, status=400)
        follow, created = Follow.objects.get_or_create(follower=request.user, following_id=target_id)
        return Response({'following': True}, status=201 if created else 200)

    @action(detail=False, methods=['get'])
    def feed(self, request):
        ids = list(request.user.following.values_list('following_id', flat=True)) + [request.user.id]
        posts = Post.objects.filter(author_id__in=ids).order_by('-created_at')[:100]
        return Response(PostSerializer(posts, many=True).data)