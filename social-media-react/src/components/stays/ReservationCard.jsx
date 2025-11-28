import React, { useContext, useState } from "react";
import { Button, Card, Badge } from "react-bootstrap";
import axiosService from "../../helpers/axios";
import { Context } from "../Layout";

function ReservationCard({ reservation, onChange }) {
  const { setToaster } = useContext(Context);
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setLoading(true);
    axiosService
      .post(`/reservation/${reservation.id}/cancel/`)
      .then(() => {
        setToaster({
          type: "info",
          title: "Reservation updated",
          message: "Your reservation was cancelled.",
          show: true,
        });
        onChange && onChange();
      })
      .catch(() => {
        setToaster({
          type: "danger",
          title: "Unable to cancel",
          message: "Please try again or contact the host.",
          show: true,
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Card.Title className="mb-1">{reservation.stay.title}</Card.Title>
            <Card.Subtitle className="text-muted">
              {reservation.stay.location}
            </Card.Subtitle>
          </div>
          <Badge bg="secondary">{reservation.status}</Badge>
        </div>
        <Card.Text className="mb-1">
          {reservation.check_in} to {reservation.check_out} · {reservation.guests} guests
        </Card.Text>
        <Card.Text className="mb-1 fw-bold">
          Total ${reservation.total_cost}
        </Card.Text>
        {reservation.status !== "CANCELLED" && (
          <div className="text-end">
            <Button variant="outline-danger" size="sm" onClick={handleCancel} disabled={loading}>
              Cancel reservation
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default ReservationCard;
