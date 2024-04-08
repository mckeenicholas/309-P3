from datetime import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from Accounts.serializers import UserSerializer, EditProfileSerializer
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class Signup(APIView):
    def get(self, request):
        return Response({'message': 'Signup GET request'}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class Login(APIView):
    def get(self, request):
        return Response({'message': 'Login GET request'}, status=status.HTTP_200_OK)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            # use authentication token stuff???
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class Profile(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def post(self, request):
        serializer = EditProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token is None:
                return Response({'error': 'Refresh token was not provided'}, status=status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            if str(e) == 'Token is blacklisted':
                return Response({'error': 'You are already logged out'}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DeleteAccount(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        
        refresh_token = request.data.get("refresh_token")
        if refresh_token is None:
            return Response({'error': 'Refresh token was not provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            user.is_active = False
            user.save()

            # TODO: Figure out what calendar tables should be updated when a user deletes their account

            return Response({'message': 'Account Deleted Successfully'}, status=status.HTTP_205_RESET_CONTENT)
        
        except TokenError as e:
            if str(e) == 'Token is blacklisted':
                return Response({'error': 'User not logged in'}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({'error': 'An error occurred while deleting the account'}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResetPasswordRequest(APIView):
    def post(self, request):
        email = request.data.get('email')

        print(email)

        if not email:
            return Response({'error': 'Email not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            token = PasswordResetTokenGenerator().make_token(user)

            # Construct the reset URL
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = request.build_absolute_uri(reverse('accounts:reset_password', kwargs={'uidb64': uid, 'token': token}))

            print(reset_url)

            # Send reset email
            send_mail(
                'Password Reset Request',
                f'Please click the following link to reset your password: {reset_url}',
                'oneononeautoemail@gmail.com',
                [user.email],
                fail_silently=False,
            )

        # Return 200 and 'success' regardless of whether email was found or not for security purposes.
        return Response({'success': 'Password reset email sent'}, status=200)


class ResetPasswordTokenCheck(APIView):
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return self.invalid_link()

        new_password = request.data.get('password')

        if new_password is None:
            return Response({'error': "no password given"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(password=new_password)
        except ValidationError as e:
            return Response({'error': e}, status=status.HTTP_400_BAD_REQUEST)
        
        if not PasswordResetTokenGenerator().check_token(user, token):
            return self.invalid_link()
        
        user.set_password(new_password)
        user.save()
        return Response({'success': 'Password reset successfully'}, status=status.HTTP_200_OK)
    
    def invalid_link(self):
        return Response({'error': 'invalid link, please re-request a password reset email'}, status=status.HTTP_400_BAD_REQUEST)
    