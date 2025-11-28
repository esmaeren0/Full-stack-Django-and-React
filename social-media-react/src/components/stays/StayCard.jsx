import React, { useContext } from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { Context } from "../Layout";

function StayCard({ stay, onSelect, canBook = true }) {
  const { setToaster } = useContext(Context);

  const handleSelect = () => {
    if (!onSelect) {
      setToaster({
        type: "warning",
        title: "No action",
        message: "Booking action is not available right now.",
        show: true,
      });
      return;
    }
    onSelect(stay);
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title className="mb-1">{stay.title}</Card.Title>
            <Card.Subtitle className="text-muted">{stay.location}</Card.Subtitle>
          </div>
          <Badge bg="secondary">Max {stay.max_guests} guests</Badge>
        </div>
        <Card.Text className="mt-3">{stay.description}</Card.Text>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {stay.amenities?.map((amenity, index) => (
            <Badge key={index} bg="info" text="dark">
              {amenity}
            </Badge>
          ))}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="fw-bold">${stay.nightly_price} / night</div>
          {canBook && (
            <Button variant="primary" onClick={handleSelect}>
              Book now
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default StayCard;
