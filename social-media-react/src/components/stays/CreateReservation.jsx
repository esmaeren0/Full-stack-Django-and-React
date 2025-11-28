import React, { useContext, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import axiosService from "../../helpers/axios";
import { getUser } from "../../hooks/user.actions";
import { Context } from "../Layout";

function CreateReservation({ stay, onCreated }) {
  const { setToaster } = useContext(Context);
  const [show, setShow] = useState(false);
  const [payload, setPayload] = useState({
    check_in: "",
    check_out: "",
    guests: 1,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = getUser();

    axiosService
      .post(`/reservation/`, {
        ...payload,
        stay: stay.id,
        guest: user.id,
        guests: Number(payload.guests),
      })
      .then(() => {
        setToaster({
          title: "Reservation requested",
          message: "We have saved your booking request.",
          type: "success",
          show: true,
        });
        setPayload({ check_in: "", check_out: "", guests: 1 });
        setShow(false);
        onCreated && onCreated();
      })
      .catch((error) => {
        setToaster({
          title: "Unable to book",
          message:
            error.response?.data?.[0] ||
            error.response?.data?.detail ||
            "Please verify your dates.",
          type: "danger",
          show: true,
        });
      });
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        Book now
      </Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Book {stay.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="checkIn">
                  <Form.Label>Check-in</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    name="check_in"
                    value={payload.check_in}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="checkOut">
                  <Form.Label>Check-out</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    name="check_out"
                    value={payload.check_out}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="guestCount">
              <Form.Label>Guests</Form.Label>
              <Form.Control
                required
                type="number"
                min="1"
                max={stay.max_guests}
                name="guests"
                value={payload.guests}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                This stay allows up to {stay.max_guests} guests.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Cancel
            </Button>
            <Button type="submit">Confirm booking</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default CreateReservation;
