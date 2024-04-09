from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics

from .models import *
from .serializers import *

CALENDAR_ACCESS_ERROR = {"error": "You are not authorized to access this calendar."}

class CalendarAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get all calendars the user is a participant of
        participant_calendars = CalendarParticipant.objects.filter(user=request.user)
        calendars = [participant.calendar for participant in participant_calendars]
        serializer = CalendarReadSerializer(calendars, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CalendarWriteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        calendar = serializer.save(owner=request.user)
        
        # Add the user as a participant for this calendar
        participant_data = {
            "user": request.user.id
        }
        participant_serializer = CalendarParticipantWriteSerializer(data=participant_data)
        if participant_serializer.is_valid():
            participant_serializer.save(calendar=calendar)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    def delete(self, request, calendar_id):
        try:
            calendar = Calendar.objects.get(id=calendar_id)
            # Check if user is the owner of the calendar
            if calendar.owner != request.user:
                return Response(CALENDAR_ACCESS_ERROR, status=status.HTTP_403_FORBIDDEN)
            
            calendar.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Calendar.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, calendar_id):
        try:
            calendar = Calendar.objects.get(id=calendar_id)
            # Check if user is the owner of the calendar
            if calendar.owner != request.user:
                return Response(CALENDAR_ACCESS_ERROR, status=status.HTTP_403_FORBIDDEN)
                
            serializer = CalendarWriteSerializer(calendar, data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            return Response(serializer.data)

        except Calendar.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class CalendarParticipantAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, calendar_id):
        participants = CalendarParticipant.objects.filter(calendar=calendar_id)

        # Check if user is a participant of the calendar
        if not participants.filter(user=request.user).exists():
            return Response(CALENDAR_ACCESS_ERROR, status=status.HTTP_403_FORBIDDEN)
        
        serializer = CalendarParticipantReadSerializer(participants, many=True)
        return Response(serializer.data)

    def post(self, request, calendar_id):
        calendar = Calendar.objects.get(id=calendar_id)

        # Check if user is the owner of the calendar
        if calendar.owner != request.user:
            return Response(CALENDAR_ACCESS_ERROR, status=status.HTTP_403_FORBIDDEN)
        
        serializer = CalendarParticipantWriteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save(calendar=calendar)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, calendar_id, user_id):
        try:
            participant = CalendarParticipant.objects.get(calendar=calendar_id, user=user_id)
            calendar = participant.calendar
            # Check if user is the owner of the calendar
            if calendar.owner != request.user:
                return Response(CALENDAR_ACCESS_ERROR, status=status.HTTP_403_FORBIDDEN)
            
            participant.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
                
        except CalendarParticipant.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class NonBusyTimeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, calendar_id):
        # Check if user is a participant of this calendar
        try:
            calendar = Calendar.objects.get(id=calendar_id)
        except Calendar.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        participants = CalendarParticipant.objects.filter(calendar=calendar, user=request.user)
        if not participants.exists():
            return Response(CALENDAR_ACCESS_ERROR, status=status.HTTP_403_FORBIDDEN)
        
        non_busy_times = NonBusyTime.objects.filter(calendar=calendar)
        
        # Check if only non busy times for the currently signed in user should be returned
        user_specific = request.query_params.get('user_specific')
        if user_specific:
            non_busy_times = non_busy_times.filter(user=request.user)
        
        serializer = NonBusyTimeReadSerializer(non_busy_times, many=True)
        return Response(serializer.data)

    def post(self, request, calendar_id):
        # Check if user is a participant of this calendar
        try:
            calendar = Calendar.objects.get(id=calendar_id)

            participants = CalendarParticipant.objects.filter(calendar=calendar, user=request.user)
            if not participants.exists():
                return Response(CALENDAR_ACCESS_ERROR, status=status.HTTP_403_FORBIDDEN)
            
            serializer = NonBusyTimeWriteSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save(user=request.user, calendar=calendar)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Calendar.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

    def delete(self, request, calendar_id, non_busy_time_id):
        try:
            non_busy_time = NonBusyTime.objects.get(id=non_busy_time_id)
            
            # Check if user is the owner of the non-busy time
            if non_busy_time.user != request.user:
                return Response(CALENDAR_ACCESS_ERROR, status=status.HTTP_403_FORBIDDEN)
            
            non_busy_time.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        except NonBusyTime.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

@api_view(['POST'])
def send_email(request):
    username = request.data.get('username')
    if not username:
        return Response({"error": "No username provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(username=username)

        send_mail(
            'OneOnOne Reminder',
            'This is a reminder for your upcoming meeting.',
            'oneononeautoemail@gmail.com',
            [user.email],
            fail_silently=False,
        )
        return Response({"message": "Email sent successfully."}, status=status.HTTP_200_OK)
    except user.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": f"Failed to send email. Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

class InvitationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Retrieve invitations based on the user's role (sender or receiver)
        if 'calendar_id' in kwargs:
            invitations = Invitation.objects.filter(calendar=kwargs['calendar_id'])
        elif 'sender_id' in kwargs:
            invitations = Invitation.objects.filter(sender=kwargs['sender_id'])
        elif 'receiver_id' in kwargs:
            invitations = Invitation.objects.filter(receiver=kwargs['receiver_id'])
        else:
            return Response({"error": "Invalid query parameters."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = InvitationReadSerializer(invitations, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        # Extract the receiver's ID from the request data
        receiver_id = request.data.get('receiver')
        
        # Check if the receiver is in the sender's contacts
        if not Contact.objects.filter(owner=request.user, contactee_id=receiver_id).exists():
            return Response({"error": "The user you are inviting is not in your contacts."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Proceed with the original logic if the check passes
        serializer = InvitationWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(sender=request.user)  # Automatically set the sender to the current user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, invitation_id):
        invitation = Invitation.objects.get(id=invitation_id)
        if request.user != invitation.sender and request.user != invitation.receiver:
            return Response({"error": "You do not have permission to delete this invitation."}, status=status.HTTP_403_FORBIDDEN)
        invitation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#gets a users id from their username
class GetUserIDAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            return Response({"user_id": user.id})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

class PendingInvitationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pending_invitations = Invitation.objects.filter(receiver=request.user, status='pending')
        serializer = InvitationReadSerializer(pending_invitations, many=True)
        return Response(serializer.data)


class UpdateInvitationStatusAPIView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Invitation.objects.all()
    serializer_class = InvitationWriteSerializer
    lookup_field = 'id'

    def patch(self, request, *args, **kwargs):
        invitation = get_object_or_404(Invitation, id=kwargs['id'])
        if invitation.receiver != request.user:
            return Response({"error": "You are not authorized to update this invitation."}, status=status.HTTP_403_FORBIDDEN)
        
        status = request.data.get('status', invitation.status)
        invitation.status = status
        invitation.save()
        
        if status == 'accepted':
            # Check if the user is already a participant of the calendar
            if not CalendarParticipant.objects.filter(calendar=invitation.calendar, user=request.user).exists():
                # Add the user as a participant of the calendar
                CalendarParticipant.objects.create(calendar=invitation.calendar, user=request.user)
        
        return Response({"message": "Invitation status updated successfully."})