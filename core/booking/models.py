from django.db import models

from core.abstract.models import AbstractModel, AbstractManager


class StayManager(AbstractManager):
    pass


class Stay(AbstractModel):
    owner = models.ForeignKey("core_user.User", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255)
    nightly_price = models.DecimalField(max_digits=8, decimal_places=2)
    max_guests = models.PositiveIntegerField(default=1)
    amenities = models.JSONField(default=list, blank=True)

    objects = StayManager()

    def __str__(self):
        return f"{self.title} - {self.location}"


class ReservationManager(AbstractManager):
    pass


class Reservation(AbstractModel):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        CANCELLED = "CANCELLED", "Cancelled"

    stay = models.ForeignKey(Stay, on_delete=models.CASCADE, related_name="reservations")
    guest = models.ForeignKey("core_user.User", on_delete=models.CASCADE)
    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.PositiveIntegerField(default=1)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )

    objects = ReservationManager()

    def __str__(self):
        return f"{self.stay.title} for {self.guest.username}"

    @property
    def nights(self):
        return (self.check_out - self.check_in).days
