from rest_framework import status
from rest_framework.response import Response

from core.abstract.viewsets import AbstractViewSet
from core.auth.permissions import UserPermission
from core.booking.models import Reservation, Stay
from core.booking.serializers import ReservationSerializer, StaySerializer


class StayViewSet(AbstractViewSet):
    http_method_names = ("post", "get", "put", "delete", "patch")
    serializer_class = StaySerializer
    permission_classes = (UserPermission,)
    filterset_fields = ["location", "owner__public_id", "max_guests"]

    def get_queryset(self):
        return Stay.objects.all()

    def get_object(self):
        obj = Stay.objects.get_object_by_public_id(self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReservationViewSet(AbstractViewSet):
    http_method_names = ("post", "get", "put", "delete", "patch")
    serializer_class = ReservationSerializer
    permission_classes = (UserPermission,)
    filterset_fields = ["stay__public_id", "guest__public_id", "status"]

    def get_queryset(self):
        return Reservation.objects.select_related("stay", "guest")

    def get_object(self):
        obj = Reservation.objects.get_object_by_public_id(self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
