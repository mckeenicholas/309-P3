from django.db import models
from django.conf import settings

from Contacts.models import Contact
import uuid

class Calendar(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    is_finalized = models.BooleanField(default=False)

class CalendarParticipant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

class NonBusyTime(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    preference_level = models.IntegerField(default=0)

class Meeting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name='meetings')
    final_time = models.DateTimeField(null=True, blank=True)
    deadline = models.DateTimeField()

class ScheduleSuggestion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='suggestions')
    suggested_time = models.DateTimeField(null=True)
    # Additional fields to rank or categorize suggestions could be added here

class Invitation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name='invitations')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_invitations')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_invitations')
    status = models.CharField(max_length=20, default='pending')  #basically their status: pending, accepted, declined