from rest_framework import serializers
from .models import *

# Calendar
class CalendarReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = '__all__'

class CalendarWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        exclude = ('owner',)

# CalendarParticipant
class CalendarParticipantWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarParticipant
        exclude = ('calendar',)

class CalendarParticipantReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarParticipant
        fields = '__all__'

# NonBusyTime
class NonBusyTimeWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = NonBusyTime
        exclude = ('user', 'calendar',)

class NonBusyTimeReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = NonBusyTime
        fields = '__all__'

class InvitationWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        exclude = ('sender',)

class InvitationReadSerializer(serializers.ModelSerializer):
    calendar = CalendarReadSerializer()
    class Meta:
        model = Invitation
        fields = '__all__'