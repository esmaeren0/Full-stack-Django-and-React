import React, { useState } from "react";
import useSWR from "swr";
import { Col, Row } from "react-bootstrap";

import Layout from "../components/Layout";
import CreateStay from "../components/stays/CreateStay";
import StayCard from "../components/stays/StayCard";
import CreateReservation from "../components/stays/CreateReservation";
import { fetcher } from "../helpers/axios";

function Stays() {
  const [selectedStay, setSelectedStay] = useState(null);
  const stays = useSWR("/stay/", fetcher, { refreshInterval: 20000 });

  return (
    <Layout>
      <Row className="justify-content-between">
        <Col lg={7}>
          {stays.data?.results.map((stay) => (
            <StayCard key={stay.id} stay={stay} onSelect={setSelectedStay} />
          ))}
        </Col>
        <Col lg={4}>
          <CreateStay refresh={stays.mutate} />
          {selectedStay && (
            <div className="border rounded p-3 shadow-sm">
              <h5 className="mb-3">Create reservation</h5>
              <p className="text-muted mb-2">
                Booking for <strong>{selectedStay.title}</strong> in
                <span className="ms-1">{selectedStay.location}</span>
              </p>
              <CreateReservation
                stay={selectedStay}
                onCreated={() => stays.mutate()}
              />
            </div>
          )}
        </Col>
      </Row>
    </Layout>
  );
}

export default Stays;
