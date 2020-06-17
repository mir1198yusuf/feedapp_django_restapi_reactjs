from rest_framework import serializers  
from feedapi_app import models 
from django.contrib.auth.models import User


#user serializer 
class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User 
		fields = ['id', 'username', 'email']


#post serializer
class PostSerializer(serializers.ModelSerializer):
	created_by = UserSerializer(read_only=True)
	#created_on_humanized = serializers.Field(source='created_on_humanized')

	class Meta:
		model = models.Post 
		fields = ['id', 'message', 'created_by', 'created_on', 'file', 'created_on_humanized']

#comment serializer 
class CommentSerializer(serializers.ModelSerializer):
	created_by = UserSerializer(read_only=True) 
	post = PostSerializer(read_only=True)
	#created_on_humanized = serializers.Field(source='created_on_humanized')

	class Meta:
		model = models.Comment 
		fields = ['id', 'message', 'created_by', 'created_on', 'post', 'created_on_humanized']