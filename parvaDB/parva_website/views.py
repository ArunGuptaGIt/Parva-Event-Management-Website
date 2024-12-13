from django.shortcuts import render
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.conf import settings
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import redirect
from functools import wraps
from .models import *
from .serializer import *


# Create your views here.

def send_event_email(event, action):
    subject = f"Your Event has been {action}"
    message = f"Dear {event.organizers_name},\n\n" \
              f"Your event '{event.venue}' scheduled for {event.booked_date} has been {action}.\n\n" \
              f"Thank you for using our platform.\n\n" \
              f"Best regards,\nTeam Urja"
    recipient = event.email  # The organizer's email address

    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,  # Ensure this is set in settings.py
            [recipient],
            fail_silently=False,
        )
        print("email sent")
    except Exception as e:
        print(f"Error sending email: {e}")
        raise


def admin_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        # Get the custom 'Authorization' header
        auth_header = request.headers.get("Authorization")
        
        if not auth_header:
            return JsonResponse({"error": "Unauthorized"}, status=401)
        
        # Split the header to get the token (assumed 'Bearer admin-token' or 'Bearer user-token')
        token_type, token_value = auth_header.split() if auth_header else (None, None)

        if token_type == 'Bearer' and token_value == 'admin-token':
            # The user is an admin, proceed
            return view_func(request, *args, **kwargs)
        
        return JsonResponse({"error": "Access denied: Admins only."}, status=403)
    return wrapper


@api_view(['POST', 'GET', 'PUT', 'PATCH'])
def event_handling(request, event_id=None):
    if request.method == 'POST':
        # Get the event data from the request
        venue = request.data.get('venue')  # Assumes 'venue' is passed in request
        booked_date = request.data.get('booked_date')
        ending_date = request.data.get('ending_date')

        if not venue or not booked_date or not ending_date:
            return Response({"detail": "Venue, start date, and end date are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Convert dates to datetime objects for comparison
        booked_date = datetime.strptime(booked_date, "%Y-%m-%dT%H:%M")
        ending_date = datetime.strptime(ending_date, "%Y-%m-%dT%H:%M")

        # Check if there are any conflicting events in the same venue during the requested time
        conflicts = approved_events.objects.filter(
            venue=venue,
            booked_date__lt=ending_date,
            ending_date__gt=booked_date
        )

        if conflicts.exists():
            return Response({"detail": "There is already an event booked during this time."}, status=status.HTTP_400_BAD_REQUEST)

        # If no conflicts, serialize and save the new event
        serializer = every_event_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'GET':
        # Handle GET request to retrieve events with status 'PENDING'
        events = every_events.objects.filter(status='PENDING')
        serializer = every_event_serializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method in ['PUT', 'PATCH']:
        if event_id is not None:
            try:
                event_instance = every_events.objects.get(id=event_id)
                serializer = every_event_serializer(event_instance, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    # Return the specific error messages from the serializer
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except every_events.DoesNotExist:
                return Response({"detail": "Event not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"detail": "ID parameter is required for updating."}, status=status.HTTP_400_BAD_REQUEST)

 

@api_view(['POST'])
def create_users(request):
    serializer = login_serializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        bob = login_info.objects.get(email=email)
        if bob.password == password:  
            return Response({"message": "Login successful","admin_or_not": bob.admin_or_not,"first_name":bob.first_name}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    except bob.DoesNotExist:
        return Response({"error": "Invalid credentialssssss"}, status=status.HTTP_401_UNAUTHORIZED)
    

@api_view(['POST'])
def search_bar(request):
    query = request.data.get("query", '')

    if query:
        # Correct the field lookups to use __icontains
        admin_result = every_event_serializer.objects.filter(
            Q(venue__icontains=query) |  # Corrected the lookup to venue__icontains
            Q(organizers_name__icontains=query) |  # Corrected the lookup to organizers_name__icontains
            Q(no_of_people__icontains=query)  # Corrected the lookup to no_of_people__icontains
        )

        # Serialize the filtered results
        admin_result_serialized = every_event_serializer(admin_result, many=True)

        return Response({
            'admins': admin_result_serialized.data,
        }, status=status.HTTP_200_OK)
    
    return Response({'error': 'No query provided'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST', 'GET', 'DELETE', 'PUT', 'PATCH'])
def insert_venue(request, venue_id=None):

    if request.method == 'POST':
        serializer = insert_venue_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'GET':
        venues = venue.objects.all()
        serializer = insert_venue_serializer(venues, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method in ['PUT', 'PATCH']:
        if venue_id is not None:
            try:
                venue_instance = venue.objects.get(id=venue_id)
                # Partial update allows omitting fields
                serializer = insert_venue_serializer(
                    venue_instance, 
                    data=request.data, 
                    partial=True
                )
                if serializer.is_valid():
                    # Retain old image if no new one is provided
                    if 'venuePhoto' not in request.FILES:
                        serializer.validated_data['venuePhoto'] = venue_instance.venuePhoto
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except venue.DoesNotExist:
                return Response({"detail": "Venue not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"detail": "ID parameter is required for updating."}, status=status.HTTP_400_BAD_REQUEST)




    elif request.method == 'DELETE':
        if venue_id is not None:
            try:
                venue_to_delete = venue.objects.get(id=venue_id)
                venue_to_delete.delete()
                return Response({"detail": "Venue deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
            except venue.DoesNotExist:
                return Response({"detail": "Venue not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"detail": "ID parameter is required for deletion."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def reject_event(request, event_id):
    try:
        # Fetch the data to be rejected
        event = every_events.objects.get(id=event_id)

        event.status = 'REJECTED'
        event.save()

        # Add the data to rejected_events
        rejected_event = rejected_events.objects.create(
            event_name = event.event_name,
            organizers_name=event.organizers_name,
            venue=event.venue,
            email=event.email,
            user_booked_date=event.user_booked_date,
            booked_date=event.booked_date,
            ending_date=event.ending_date,
            no_of_people=event.no_of_people,
            phone_number=event.phone_number,
            venuePhoto=event.venuePhoto,
            status='REJECTED'
        )

        send_event_email(event, 'rejected')
        rejected_event_data = rejected_event_serializer(rejected_event).data

        return Response(
            {"message": "Event rejected successfully", "rejected_event": rejected_event_data},
            status=status.HTTP_200_OK
        )

    except every_events.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['POST'])
def accept_event(request, event_id):
    try:
        event = every_events.objects.get(id=event_id)  


        event.status = 'APPROVED'
        event.save()


        accepted_event = approved_events.objects.create(
            event_name = event.event_name,
            organizers_name=event.organizers_name,
            venue=event.venue,
            email=event.email,
            user_booked_date=event.user_booked_date,
            booked_date=event.booked_date,
            ending_date=event.ending_date,
            no_of_people=event.no_of_people,
            phone_number=event.phone_number,
            venuePhoto=event.venuePhoto,
            status='APPROVED'
        )

        send_event_email(event, 'approved')
        # Serialize the rejected event data to return in the response
        accepted_event_data = approved_event_serializer(accepted_event).data

        return Response(
            {"message": "Event accepted successfully", "accepted_event": accepted_event_data},
            status=status.HTTP_200_OK
        )

    except every_events.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def approved_events_getter(request):
    approved_eventss = approved_events.objects.all()
    serializer = approved_event_serializer(approved_eventss, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def history_view(request):
    events = every_events.objects.filter(status__in=['APPROVED', 'REJECTED'])

    serialzer = every_event_serializer(events, many=True)
    return Response(serialzer.data, status=status.HTTP_200_OK)