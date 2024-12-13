from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import *



urlpatterns = [
    path('admins/add_event/',event_handling,name='event_handeling'),
    # path('admins/approve_event/',event_handling,name='approve_event'),
    # path('admins/reject_event/',event_handling,name='reject_event'), 
    path('admins/login/', login_user, name='login_admin'),
    path('admins/search/', search_bar,name='search_bar'),
    path('admins/signup/',create_users,name='create_users'),
    path('admins/add_venue/', insert_venue, name='insert_venue'),
    path('admins/add_venue/<int:venue_id>/', insert_venue, name='insert_venue'),
    path('admins/add_venue/<int:venue_id>/', insert_venue, name='update_or_delete_venue'),
    path('admins/reject_event/<int:event_id>/', reject_event, name='reject_event'),
    path('admins/accept_event/<int:event_id>/', accept_event, name='accept_event'),
    path('admins/approved_events/', approved_events_getter, name='approved_events'),
    path('admins/get_history/', history_view, name='history_view')
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)