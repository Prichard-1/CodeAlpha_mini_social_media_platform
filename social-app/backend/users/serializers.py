from django.contrib.auth.models import User
from rest_framework import serializers
from social.models import Profile

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    def create(self, data):
        user = User.objects.create_user(
            username=data['username'], email=data.get('email',''), password=data['password']
        )
        Profile.objects.get_or_create(user=user)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Profile
        fields = ['username', 'bio', 'avatar']