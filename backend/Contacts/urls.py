from django.urls import path
from .views import ContactList, AddContact, DeleteContactView

app_name = 'contacts'
urlpatterns = [
    path('', ContactList.as_view(), name='contact-list'),
    path('add/', AddContact.as_view(), name='add'),
    path('delete/<str:contactee>/', DeleteContactView.as_view(), name='delete_contact'),
]
