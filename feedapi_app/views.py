import knox.views
from rest_framework import permissions
from rest_framework.authtoken import serializers as rest_serializers
from django.contrib import auth
from feedapi_app import serializers
from rest_framework.response import Response
from knox.auth import TokenAuthentication
from rest_framework import status
from rest_framework.views import APIView
from feedapi_app import models
from rest_framework.parsers import MultiPartParser, FormParser


# Create your views here.

#login view by overriding knoxlogin view as per doc
class LoginView(knox.views.LoginView):
	permission_classes = (permissions.AllowAny,)

	def post(self, request, format=None):
		serializer = rest_serializers.AuthTokenSerializer(data=request.data) 
		serializer.is_valid(raise_exception=True) 
		user = serializer.validated_data['user']
		auth.login(request, user) 
		return super().post(request, format=None)

	#override acc to docs 
	def get_post_response_data(self, request, token, instance):
		UserSerializer = self.get_user_serializer_class()
		data = {
			'expiry' : self.format_expiry_datetime(instance.expiry),
			'token' : token ,
			'username' : request.user.username
		}
		return data

#get/create posts
class PostsView(APIView):
	"""
	lists all posts or create a post
	"""

	permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
	authentication_classes = (TokenAuthentication, )
	parser_classes = (MultiPartParser, FormParser)	#for handling files
	
	def get(self, request):
		posts = models.Post.objects.all().order_by('-created_on')
		#GET parameters filter
		keyword = request.query_params.get('keyword')
		created_by = request.query_params.get('created_by')
		if keyword:
			posts = posts.filter(message__contains=keyword)
		if created_by:
			posts = posts.filter(created_by__username__contains=created_by)
		serializer = serializers.PostSerializer(posts, many=True) 
		return Response(serializer.data)

	def post(self, request):
		serializer = serializers.PostSerializer(data=request.data)
		if serializer.is_valid():
			#update created_by from request.user which is set acc to token value from header
			serializer.validated_data['created_by'] = request.user 
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# get/create comment
class CommentsView(APIView):
	"""
	list comments for a post or create a comment for a post
	"""
	permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
	authentication_classes = (TokenAuthentication, )

	def get_post_object(self, post_id):
		try:
			return models.Post.objects.get(id=post_id)
		except models.Post.DoesNotExist:
			return Response(status=status.HTTP_404_NOT_FOUND)

	def get(self, request, post_id):
		post = self.get_post_object(post_id)
		comments = models.Comment.objects.all().filter(post=post).order_by("-created_on")
		serializer = serializers.CommentSerializer(comments, many=True)
		return Response(serializer.data)

	def post(self, request, post_id):
		post = self.get_post_object(post_id)
		serializer = serializers.CommentSerializer(data=request.data)
		if serializer.is_valid():
			#update created_by from request.user which is set acc to token value from header
			serializer.validated_data['created_by'] = request.user 
			#set post value from url post_id object
			serializer.validated_data['post'] = post
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)