from django.db import models
from django.contrib.auth.models import User
from django.contrib.humanize.templatetags.humanize import naturaltime

# Create your models here.

class Post(models.Model):
	message = models.CharField(max_length=5000)
	created_by = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='posts', null=True)
	created_on = models.DateTimeField(auto_now_add=True)
	file = models.FileField(blank=True)	#optional field

	def __str__(self):
		return self.message

	def created_on_humanized(self):
		return naturaltime(self.created_on)


class Comment(models.Model):
	message = models.CharField(max_length=2000)
	created_by = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='comments', null=True)
	created_on = models.DateTimeField(auto_now_add=True)
	post = models.ForeignKey(Post, on_delete=models.SET_NULL, related_name='comments', null=True)

	def __str__(self):
		return self.message

	def created_on_humanized(self):
		return naturaltime(self.created_on)