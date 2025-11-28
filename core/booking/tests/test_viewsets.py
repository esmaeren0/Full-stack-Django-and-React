from datetime import date, timedelta

from rest_framework import status

from core.fixtures.stay import reservation, stay
from core.fixtures.user import user


class TestStayViewSet:
    endpoint = "/api/stay/"

    def test_list_stays(self, client, stay):
        response = client.get(self.endpoint)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1

    def test_create_stay_requires_authentication(self, client):
        data = {
            "title": "Villa",
            "description": "Private pool",
            "location": "Bodrum",
            "nightly_price": 200,
            "max_guests": 4,
            "amenities": ["Pool"],
            "owner": "invalid",
        }
        response = client.post(self.endpoint, data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_stay(self, client, user):
        client.force_authenticate(user=user)
        data = {
            "title": "Mountain Cabin",
            "description": "Secluded and quiet",
            "location": "Rize",
            "nightly_price": 150,
            "max_guests": 2,
            "amenities": ["Fireplace"],
            "owner": user.public_id.hex,
        }
        response = client.post(self.endpoint, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["owner"]["id"] == user.public_id.hex


class TestReservationViewSet:
    endpoint = "/api/reservation/"

    def test_list_reservations(self, client, reservation):
        response = client.get(self.endpoint)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1

    def test_create_reservation(self, client, stay, user):
        client.force_authenticate(user=user)
        payload = {
            "stay": stay.public_id.hex,
            "guest": user.public_id.hex,
            "check_in": (date.today() + timedelta(days=10)).isoformat(),
            "check_out": (date.today() + timedelta(days=12)).isoformat(),
            "guests": 2,
        }
        response = client.post(self.endpoint, payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["stay"]["id"] == stay.public_id.hex

    def test_prevent_past_reservation(self, client, stay, user):
        client.force_authenticate(user=user)
        payload = {
            "stay": stay.public_id.hex,
            "guest": user.public_id.hex,
            "check_in": (date.today() - timedelta(days=1)).isoformat(),
            "check_out": (date.today() + timedelta(days=2)).isoformat(),
            "guests": 1,
        }
        response = client.post(self.endpoint, payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_cancel_reservation(self, client, reservation, user):
        client.force_authenticate(user=user)
        url = f"{self.endpoint}{reservation.public_id}/cancel/"
        response = client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["status"] == reservation.Status.CANCELLED
