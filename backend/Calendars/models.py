from django.db import models
from django.conf import settings

from Contacts.models import Contact
import uuid

DAYS_OF_THE_WEEK = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]

class Calendar(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    meeting_length = models.IntegerField(default=60)
    deadline = models.DateTimeField(null=True)
    finalized_day_of_week = models.IntegerField(choices=DAYS_OF_THE_WEEK, null=True)
    finalized_time = models.TimeField(null=True)

class CalendarParticipant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

class NonBusyTime(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    day_of_week = models.IntegerField(choices=DAYS_OF_THE_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    preference_level = models.IntegerField(default=0)

class Invitation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, related_name='invitations')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_invitations')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_invitations')
    status = models.CharField(max_length=20, default='pending')  #basically their status: pending, accepted, declined