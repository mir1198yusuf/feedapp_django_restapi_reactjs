# Sample Feed app built in Django REST and React.js


I created this project as a part of tech evaluation in first two weeks of internship at a startup.

## Earlier task

- Earlier I built the project completely using Django. 
- You can see the project here : [code](http://bit.ly/feed_code)
- Demo live site link : [site](http://bit.ly/feed_live)

## New task - Extension to above project :

- I was asked to use React.js as front-end for the same project.
- So, the choice was to convert back-end Django code to REST APIs which React.js would call from front-end.
- The front-end is built in React.js and Django REST APIs are used to interact with backend.

I was new to Django REST framework and React.js both.
So, I learned both of them and built this project.


*This sample application contains limited features and therefore can be updated to include new ones.*


## Brief description of project:

- It is basically like a mini-feeds app like LinkedIn or Facebook where user can create post and other users can see, comment. 


## Functionalities included in project:

1. User can create post including text and file of any type.
2. On Feed page user can see posts of all other users with details like created by, created on, post, comments.
3. If file in post is video/image it will be displayed along with the post using html <img> or <video> tag. For other types, just the url link will be displayed for downloading it.
4. User can filter the post using two filters : keyword in post or created_by user id
5. Pagination at bottom  for post page. (Pagination done at React.js side and not Django back-end side)
6. User can comment on other posts.
7. Login/Logout feature with API token management.

## Login/Logout : 

- After logging, the API endpoint will return an auth token. 
- It will be stored on browser session storage. 
- For all subsequent POST requests, this token will be passed in request header for authentication. 
- After logging out, the auth token will expire and removed from backend database.
- All further POST requests will consider this token as invalid.
- Each client (mobile, desktop, etc) will receive a new token on login even for same user.
- All thanks to [django-rest-knox](https://github.com/James1345/django-rest-knox) library


## Tools and technologies :

- Django - Python framework for web application
- djangorestframework - framework for making REST APIs in Django
- HTML - for building structure of web pages
- W3.CSS - CSS framework which is similar to Bootstrap
- python-decouple - Python library for separating secret setting parameters of project from source code
- dj_database_url - Python library to simplify database connection values
- django-cors-headers - Python library for allowing CORS request to Django REST APIs
- django-rest-knox - Python library for auth token management for API calls
- PythonAnywhere - for deployment of django application, serving static & media files
- React.js - JavaScript library for building UI
- axios - JavaScript library for calling API endpoints from React.js
- react-js-pagination - for managing pagination at React.js side
- Firebase Hosting - for deployment of React.js app
- Sublime Text Editor - for writing code
- Git - for version control


## Demo live site

The project is live at [site](https://bit.ly/feed_django_reactjs_live)


