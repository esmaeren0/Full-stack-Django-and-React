import React, { useContext, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import axiosService from "../../helpers/axios";
import { getUser } from "../../hooks/user.actions";
import { Context } from "../Layout";

function CreateStay({ refresh }) {
  const { setToaster } = useContext(Context);
  const [payload, setPayload] = useState({
    title: "",
    description: "",
    location: "",
    nightly_price: "",
    max_guests: 1,
    amenities: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = getUser();
    const amenities = payload.amenities
      .split(",")
      .map((amenity) => amenity.trim())
      .filter(Boolean);

    axiosService
      .post(`/stay/`, {
        ...payload,
        amenities,
        owner: user.id,
        nightly_price: Number(payload.nightly_price),
        max_guests: Number(payload.max_guests),
      })
      .then(() => {
        setToaster({
          title: "Stay created",
          message: "Your listing is now live.",
          type: "success",
          show: true,
        });
        setPayload({
          title: "",
          description: "",
          location: "",
          nightly_price: "",
          max_guests: 1,
          amenities: "",
        });
        refresh && refresh();
      })
      .catch((error) => {
        setToaster({
          title: "Unable to create stay",
          message: error.response?.data?.detail || "Please check your inputs.",
          type: "danger",
          show: true,
        });
      });
  };

  return (
    <Form onSubmit={handleSubmit} className="border rounded p-3 shadow-sm mb-4">
      <h5 className="mb-3">List a new stay</h5>
      <Row className="mb-2">
        <Col>
          <Form.Group controlId="stayTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              required
              name="title"
              value={payload.title}
              onChange={handleChange}
              placeholder="Beach house with a view"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="stayLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control
              required
              name="location"
              value={payload.location}
              onChange={handleChange}
              placeholder="Antalya, Türkiye"
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-2" controlId="stayDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={payload.description}
          onChange={handleChange}
          placeholder="Tell guests what makes this stay special"
        />
      </Form.Group>
      <Row className="mb-2">
        <Col>
          <Form.Group controlId="stayPrice">
            <Form.Label>Nightly price ($)</Form.Label>
            <Form.Control
              required
              name="nightly_price"
              type="number"
              value={payload.nightly_price}
              onChange={handleChange}
              min="1"
              step="0.01"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="stayGuests">
            <Form.Label>Maximum guests</Form.Label>
            <Form.Control
              required
              name="max_guests"
              type="number"
              value={payload.max_guests}
              onChange={handleChange}
              min="1"
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3" controlId="stayAmenities">
        <Form.Label>Amenities (comma separated)</Form.Label>
        <Form.Control
          name="amenities"
          value={payload.amenities}
          onChange={handleChange}
          placeholder="WiFi, Breakfast, Parking"
        />
      </Form.Group>
      <div className="text-end">
        <Button type="submit">Publish stay</Button>
      </div>
    </Form>
  );
}

export default CreateStay;
