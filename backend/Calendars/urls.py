from django.urls import path
from .views import send_email, GetUserIDAPIView, PendingInvitationsAPIView, UpdateInvitationStatusAPIView
from Calendars import views

urlpatterns = [
     
     
     # Calendar
          path('', 
          views.CalendarAPIView.as_view(), 
          name='calendar'),
     path('<uuid:calendar_id>/', 
          views.CalendarAPIView.as_view(), 
          name='delete_or_update_calendar'),

     # Participants
     path('<uuid:calendar_id>/participants/', 
          views.CalendarParticipantAPIView.as_view(), 
          name='participants'),
     path('<uuid:calendar_id>/participants/<int:user_id>/',
          views.CalendarParticipantAPIView.as_view(), 
          name='delete_participant'),

     # NonBusyTime
     path('<uuid:calendar_id>/nonbusytimes/', 
          views.NonBusyTimeAPIView.as_view(), 
          name='nonbusytimes'),
     path('<uuid:calendar_id>/nonbusytimes/<uuid:non_busy_time_id>/', 
          views.NonBusyTimeAPIView.as_view(), 
          name='delete_nonbusytime'),

     # Invitations
     path('invitations/', views.InvitationAPIView.as_view(), name='invitations'),
     path('invitations/<uuid:invitation_id>/', views.InvitationAPIView.as_view(), name='delete_invitation'),

     # Send Email
     path('send-email/', send_email, name='send_email'),
     #get pending invites
     path('invitations/pending/', PendingInvitationsAPIView.as_view(), name='pending_invitations'),
     path('invitations/update/<uuid:id>/', views.UpdateInvitationStatusAPIView.as_view(), name='update_invitation'),

]