import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import useSWR from "swr";

import Layout from "../components/Layout";
import CreateStay from "../components/stays/CreateStay";
import StayCard from "../components/stays/StayCard";
import CreateReservation from "../components/stays/CreateReservation";
import ReservationCard from "../components/stays/ReservationCard";
import { fetcher } from "../helpers/axios";
import { getUser } from "../hooks/user.actions";

function Home() {
  const [selectedStay, setSelectedStay] = useState(null);
  const user = getUser();

  const stays = useSWR("/stay/", fetcher, { refreshInterval: 20000 });
  const reservations = useSWR(
    user ? `/reservation/?guest__public_id=${user.id}` : null,
    fetcher,
    { refreshInterval: 20000 }
  );

  return (
    <Layout>
      <Row className="justify-content-between">
        <Col lg={7}>
          <h4 className="mb-3">Explore stays</h4>
          {stays.data?.results.map((stay) => (
            <StayCard key={stay.id} stay={stay} onSelect={setSelectedStay} />
          ))}
        </Col>
        <Col lg={4}>
          <CreateStay refresh={stays.mutate} />
          {selectedStay && (
            <div className="border rounded p-3 shadow-sm mb-4">
              <h5 className="mb-3">Book your stay</h5>
              <p className="text-muted mb-2">
                Booking for <strong>{selectedStay.title}</strong>
                <span className="ms-1">({selectedStay.location})</span>
              </p>
              <CreateReservation stay={selectedStay} onCreated={() => reservations.mutate()} />
            </div>
          )}
          <div className="border rounded p-3 shadow-sm">
            <h5 className="mb-3">My reservations</h5>
            {reservations.data?.results.length ? (
              reservations.data.results.map((booking) => (
                <ReservationCard key={booking.id} reservation={booking} onChange={reservations.mutate} />
              ))
            ) : (
              <p className="text-muted mb-0">You have no reservations yet.</p>
            )}
          </div>
        </Col>
      </Row>
    </Layout>
  );
}

export default Home;
