from datetime import date

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.abstract.serializers import AbstractSerializer
from core.booking.models import Reservation, Stay
from core.user.models import User
from core.user.serializers import UserSerializer


class StaySerializer(AbstractSerializer):
    owner = serializers.SlugRelatedField(
        queryset=User.objects.all(), slug_field="public_id"
    )

    class Meta:
        model = Stay
        fields = [
            "id",
            "owner",
            "title",
            "description",
            "location",
            "nightly_price",
            "max_guests",
            "amenities",
            "created",
            "updated",
        ]

    def validate_owner(self, value):
        if self.context["request"].user != value:
            raise ValidationError("You can only create stays for your own account.")
        return value

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["owner"] = UserSerializer(instance.owner, context=self.context).data
        return rep


class ReservationSerializer(AbstractSerializer):
    stay = serializers.SlugRelatedField(queryset=Stay.objects.all(), slug_field="public_id")
    guest = serializers.SlugRelatedField(
        queryset=User.objects.all(), slug_field="public_id"
    )
    total_cost = serializers.SerializerMethodField()
    nights = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = [
            "id",
            "stay",
            "guest",
            "check_in",
            "check_out",
            "guests",
            "status",
            "total_cost",
            "nights",
            "created",
            "updated",
        ]
        read_only_fields = ["status"]

    def get_total_cost(self, instance):
        return float(instance.nights * instance.stay.nightly_price)

    def get_nights(self, instance):
        return instance.nights

    def validate_guest(self, value):
        if self.context["request"].user != value:
            raise ValidationError("You can only book stays for your own account.")
        return value

    def validate(self, attrs):
        check_in = attrs.get("check_in") or getattr(self.instance, "check_in", None)
        check_out = attrs.get("check_out") or getattr(self.instance, "check_out", None)
        stay = attrs.get("stay") or getattr(self.instance, "stay", None)
        guests = attrs.get("guests") or getattr(self.instance, "guests", None)

        if not check_in or not check_out or not stay or not guests:
            return attrs

        if check_in >= check_out:
            raise ValidationError("Check-out must be after check-in.")

        if check_in < date.today():
            raise ValidationError("Check-in date cannot be in the past.")

        if guests > stay.max_guests:
            raise ValidationError("Guest count exceeds stay capacity.")

        overlapping = Reservation.objects.filter(
            stay=stay,
            status__in=[Reservation.Status.PENDING, Reservation.Status.CONFIRMED],
            check_in__lt=check_out,
            check_out__gt=check_in,
        )

        if self.instance:
            overlapping = overlapping.exclude(pk=self.instance.pk)

        if overlapping.exists():
            raise ValidationError("Stay is not available for the selected dates.")

        return attrs

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["stay"] = StaySerializer(instance.stay, context=self.context).data
        rep["guest"] = UserSerializer(instance.guest, context=self.context).data
        return rep
