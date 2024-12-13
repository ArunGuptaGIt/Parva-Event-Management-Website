from rest_framework import serializers
from .models import *
from django.utils import timezone
from rest_framework import serializers
from .models import *
from datetime import datetime



class every_event_serializer(serializers.ModelSerializer):
    class Meta:
        model = every_events
        fields = '__all__'

    def validate(self, data):
        current_date = timezone.now()

        # Ensure booked_date is not in the past
        if data['booked_date'] < current_date:
            raise serializers.ValidationError({
                "booked_date": "Booked date cannot be in the past."
            })

        # Ensure the ending_date is after the booked_date
        if data['booked_date'] >= data['ending_date']:
            raise serializers.ValidationError({
                "ending_date": "Ending date must be after the start date."
            })
        
        # Check if the venue exists
        venue_name = data['venue']
        try:
            venue_ = venue.objects.get(name__iexact=venue_name)
        except venue.DoesNotExist:
            raise serializers.ValidationError({
                "venue": f"Venue '{venue_name}' does not exist."
            })

        # Ensure the number of people does not exceed the venue capacity
        if data['no_of_people'] > venue_.capacity:
            raise serializers.ValidationError({
                "no_of_people": f"The number of people ({data['no_of_people']}) exceeds the venue capacity ({venue_.capacity})."
            })

        return data





class approved_event_serializer(serializers.ModelSerializer):
    class Meta:
        model = approved_events
        fields = '__all__'

class rejected_event_serializer(serializers.ModelSerializer):
    class Meta:
        model = rejected_events
        fields = '__all__'

class login_serializer(serializers.ModelSerializer):
    class Meta:
        model = login_info
        fields = '__all__' 

class insert_venue_serializer(serializers.ModelSerializer):
    venuePhoto = serializers.ImageField(required=False)

    class Meta:
        model = venue
        fields = '__all__'
