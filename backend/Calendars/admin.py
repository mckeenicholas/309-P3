from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Calendar)
admin.site.register(CalendarParticipant)
admin.site.register(NonBusyTime)
admin.site.register(Meeting)
admin.site.register(ScheduleSuggestion)
admin.site.register(Invitation)
