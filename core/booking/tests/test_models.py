from datetime import date, timedelta

import pytest
from rest_framework.exceptions import ValidationError

from core.fixtures.stay import reservation, stay
from core.fixtures.user import user
from core.booking.models import Reservation
from core.booking.serializers import ReservationSerializer


@pytest.mark.django_db
def test_stay_str(stay):
    assert str(stay) == f"{stay.title} - {stay.location}"


@pytest.mark.django_db
def test_reservation_str(reservation):
    assert str(reservation) == f"{reservation.stay.title} for {reservation.guest.username}"


@pytest.mark.django_db
def test_reservation_nights(reservation):
    assert reservation.nights == 3


@pytest.mark.django_db
def test_reservation_validation_prevents_overlaps(stay, user):
    payload = {
        "stay": stay.public_id,
        "guest": user.public_id,
        "check_in": date.today() + timedelta(days=3),
        "check_out": date.today() + timedelta(days=6),
        "guests": 2,
    }
    Reservation.objects.create(
        stay=stay,
        guest=user,
        check_in=date.today() + timedelta(days=2),
        check_out=date.today() + timedelta(days=5),
        guests=2,
    )
    serializer = ReservationSerializer(data=payload, context={"request": type("obj", (), {"user": user})()})
    with pytest.raises(ValidationError):
        serializer.is_valid(raise_exception=True)
