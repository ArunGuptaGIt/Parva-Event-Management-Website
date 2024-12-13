from django.db import models
from django.core.validators import RegexValidator
from django.utils.timezone import now


# Create your models here.
class every_events(models.Model):
    event_name = models.CharField(max_length=255)
    organizers_name = models.CharField(max_length=255)
    venue = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    user_booked_date = models.DateTimeField(auto_now_add=True)
    booked_date = models.DateTimeField()
    ending_date = models.DateTimeField()
    no_of_people = models.IntegerField()
    phone_number = models.CharField(max_length=255)
    status = models.CharField(max_length=9,default='PENDING')
    venuePhoto = models.CharField(max_length=255)

class approved_events(models.Model):
    event_name = models.CharField(max_length=255)
    organizers_name = models.CharField(max_length=255)
    venue = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    user_booked_date = models.DateTimeField(auto_now_add=True)
    booked_date = models.DateTimeField()
    ending_date = models.DateTimeField()
    no_of_people = models.IntegerField()
    phone_number = models.CharField(max_length=255)
    status = models.CharField(max_length=255,default='APPROVED')
    venuePhoto = models.CharField(max_length=255)

class rejected_events(models.Model):
    event_name = models.CharField(max_length=255 ,default='Nice')
    organizers_name = models.CharField(max_length=255)
    venue = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    user_booked_date = models.DateTimeField(auto_now_add=True)
    booked_date = models.DateTimeField()
    ending_date = models.DateTimeField()
    no_of_people = models.IntegerField()
    phone_number = models.CharField(max_length=255)
    status = models.CharField(max_length=255,default='REJECTED')
    venuePhoto = models.CharField(max_length=255)

class login_info(models.Model):
    admin_or_not = models.BooleanField(default=False)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255, null=False)
    middle_name = models.CharField(max_length=255, null = True)
    last_name = models.CharField(max_length=255, null=False)
    phone_numbers = models.CharField(max_length=255)

class venue(models.Model):
    name = models.CharField(max_length=255)
    capacity = models.IntegerField()
    location = models.CharField(max_length=255)
    description = models.TextField()
    contact = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    venuePhoto = models.ImageField(upload_to='images/', null=True, blank=True)