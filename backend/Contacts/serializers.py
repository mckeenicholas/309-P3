from rest_framework import serializers
from .models import Contact
from django.contrib.auth.models import User

class UserContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name']

class ContactSerializer(serializers.ModelSerializer):
    contactee_info = UserContactInfoSerializer(source='contactee', read_only=True)
    class Meta:
        model = Contact
        fields = ['id', 'owner', 'contactee', 'contactee_info']
        extra_kwargs = {
            'owner': {'write_only': True}
        }

class ContactCreateSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)

    def validate_username(self, value):
        if value == self.context['request'].user.username:
            raise serializers.ValidationError("You cannot add yourself as a contact.")
        try:
            User.objects.get(username=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("A user with this username does not exist.")
        return value

    def create(self, validated_data):
        contactee = User.objects.get(username=validated_data['username'])
        owner = self.context['request'].user
        if contactee == owner:
            raise serializers.ValidationError("You cannot add yourself as a contact.")
        if Contact.objects.filter(owner=owner, contactee=contactee).exists():
            raise serializers.ValidationError("This contact already exists.")
        return Contact.objects.create(owner=owner, contactee=contactee)