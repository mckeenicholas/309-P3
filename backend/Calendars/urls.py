from django.urls import path
from .views import send_email, GetUserIDAPIView
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
    
    # Meeting
    path('<uuid:calendar_id>/meetings/', 
         views.MeetingAPIView.as_view(), 
         name='meeting'),
    path('<uuid:calendar_id>/meetings/<uuid:meeting_id>/', 
         views.MeetingAPIView.as_view(), 
         name='delete_or_update_meeting'),

    # ScheduleSuggestion
    path('meetings/<uuid:meeting_id>/suggestion/', 
         views.ScheduleSuggestionAPIView.as_view(), 
         name='suggestion'),
    path('meetings/<uuid:meeting_id>/suggestion/<uuid:schedule_suggestion_id>/', 
         views.ScheduleSuggestionAPIView.as_view(), 
         name='delete_suggestion'),
    
    # Invitations
    path('invitations/', views.InvitationAPIView.as_view(), name='invitations'),
    path('invitations/<uuid:invitation_id>/', views.InvitationAPIView.as_view(), name='delete_invitation'),

    # Send Email
    path('send-email/', send_email, name='send_email'),
    path('get-user-id/<str:username>/', GetUserIDAPIView.as_view(), name='get_user_id'),

]