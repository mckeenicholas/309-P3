from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

app_name = 'accounts'
urlpatterns = [ 
    path('signup/', Signup.as_view(), name='signup'),
    path('login/', Login.as_view(), name='login'),
    path('profile/', Profile.as_view(), name='profile'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/delete/', DeleteAccount.as_view(), name='delete_accounts'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('password_reset/', ResetPasswordRequest.as_view(), name='reset_password_request'),
    path('password_reset/<uidb64>/<token>', ResetPasswordTokenCheck.as_view(), name='reset_password')
]