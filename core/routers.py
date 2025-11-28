from rest_framework_nested import routers

from core.user.viewsets import UserViewSet
from core.auth.viewsets import (
    RegisterViewSet,
    LoginViewSet,
    RefreshViewSet,
    LogoutViewSet,
)
from core.booking.viewsets import StayViewSet, ReservationViewSet

router = routers.SimpleRouter()

# ##################################################################### #
# ################### AUTH                       ###################### #
# ##################################################################### #

router.register(r"auth/register", RegisterViewSet, basename="auth-register")
router.register(r"auth/login", LoginViewSet, basename="auth-login")
router.register(r"auth/refresh", RefreshViewSet, basename="auth-refresh")
router.register(r"auth/logout", LogoutViewSet, basename="auth-logout")


# ##################################################################### #
# ################### USER                       ###################### #
# ##################################################################### #

router.register(r"user", UserViewSet, basename="user")

# ##################################################################### #
# ################### BOOKING                   ###################### #
# ##################################################################### #

router.register(r"stay", StayViewSet, basename="stay")
router.register(r"reservation", ReservationViewSet, basename="reservation")

# ##################################################################### #
# ################### ROUTER URLPATTERNS         ###################### #
# ##################################################################### #

urlpatterns = [*router.urls]
