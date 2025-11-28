import pytest
from datetime import date, timedelta

from core.booking.models import Reservation, Stay
from core.fixtures.user import user


@pytest.fixture
def stay(db, user):
    return Stay.objects.create(
        owner=user,
        title="Sea View Apartment",
        description="A cozy spot near the marina.",
        location="Izmir, Türkiye",
        nightly_price=120.50,
        max_guests=3,
        amenities=["WiFi", "Breakfast"],
    )


@pytest.fixture
def reservation(db, stay, user):
    return Reservation.objects.create(
        stay=stay,
        guest=user,
        check_in=date.today() + timedelta(days=2),
        check_out=date.today() + timedelta(days=5),
        guests=2,
        status=Reservation.Status.CONFIRMED,
    )
