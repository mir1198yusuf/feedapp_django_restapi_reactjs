from django.urls import path
from feedapi_app import views
import knox.views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='knox_login'),
    path('logout/', knox.views.LogoutView.as_view(), name='knox_logout'),
    path('posts/', views.PostsView.as_view(), name='posts_url'),
    path('posts/<int:post_id>/', views.CommentsView.as_view(), name='comments_url'),
]
