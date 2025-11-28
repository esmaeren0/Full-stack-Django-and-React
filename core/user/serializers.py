from rest_framework import serializers
from django.conf import settings

from core.abstract.serializers import AbstractSerializer
from core.user.models import User
from core.booking.models import Reservation, Stay


class UserSerializer(AbstractSerializer):
    stays_count = serializers.SerializerMethodField()
    reservations_count = serializers.SerializerMethodField()

    def get_stays_count(self, instance):
        return Stay.objects.filter(owner=instance).count()

    def get_reservations_count(self, instance):
        return Reservation.objects.filter(guest=instance).count()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if not representation["avatar"]:
            representation["avatar"] = settings.DEFAULT_AVATAR_URL
            return representation
        if settings.DEBUG:  # debug enabled for dev
            request = self.context.get("request")
            representation["avatar"] = request.build_absolute_uri(
                representation["avatar"]
            )
        return representation

    class Meta:
        model = User
        # List of all the fields that can be included in a request or a response
        fields = [
            "id",
            "username",
            "name",
            "first_name",
            "last_name",
            "bio",
            "avatar",
            "email",
            "is_active",
            "created",
            "updated",
            "stays_count",
            "reservations_count",
        ]
        # List of all the fields that can only be read by the user
        read_only_field = ["is_active"]
