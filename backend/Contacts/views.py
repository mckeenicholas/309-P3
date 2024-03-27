from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Contact
from .serializers import ContactSerializer, ContactCreateSerializer
from django.contrib.auth.models import User
# 8fc3b567-bd7c-431a-b68a-b885d9df8199
class ContactList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        contacts = Contact.objects.filter(owner=request.user)
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)

class AddContact(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ContactCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Contact added successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteContactView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, username):
        try:
            contactee = User.objects.get(username=username)
            contact = Contact.objects.get(owner=request.user, contactee=contactee)
            contact.delete()
            return Response({'message': 'Contact deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'error': 'Contact not found'}, status=status.HTTP_404_NOT_FOUND)