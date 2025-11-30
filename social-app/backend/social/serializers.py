from rest_framework import serializers
from .models import Post, Comment, Follow

class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'author_username', 'body', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    like_count = serializers.IntegerField(source='postlike_set.count', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'author_username', 'body', 'image', 'created_at', 'like_count', 'comments']

class FollowSerializer(serializers.ModelSerializer):
    follower_username = serializers.CharField(source='follower.username', read_only=True)
    following_username = serializers.CharField(source='following.username', read_only=True)
    class Meta:
        model = Follow
        fields = ['id', 'follower_username', 'following_username', 'created_at']