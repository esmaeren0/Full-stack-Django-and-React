import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import ProfileDetails from "../components/profile/ProfileDetails";
import useSWR from "swr";
import { fetcher } from "../helpers/axios";
import { Row, Col } from "react-bootstrap";
import StayCard from "../components/stays/StayCard";
import ReservationCard from "../components/stays/ReservationCard";

function Profile() {
  const { profileId } = useParams();

  const user = useSWR(`/user/${profileId}/`, fetcher);
  const stays = useSWR(`/stay/?owner__public_id=${profileId}`, fetcher);
  const reservations = useSWR(
    `/reservation/?guest__public_id=${profileId}`,
    fetcher,
    { refreshInterval: 20000 }
  );

  return (
    <Layout hasNavigationBack>
      <Row className="justify-content-evenly">
        <Col sm={9}>
          <ProfileDetails user={user.data} />
          <div className="my-4">
            <h5 className="mb-3">Hosted stays</h5>
            <Row>
              {stays.data?.results.length ? (
                stays.data.results.map((stay) => (
                  <StayCard key={stay.id} stay={stay} canBook={false} />
                ))
              ) : (
                <p className="text-muted">No stays published yet.</p>
              )}
            </Row>
          </div>
          <div className="my-4">
            <h5 className="mb-3">Reservations</h5>
            <Row>
              {reservations.data?.results.length ? (
                reservations.data.results.map((booking) => (
                  <ReservationCard key={booking.id} reservation={booking} />
                ))
              ) : (
                <p className="text-muted">No reservations found.</p>
              )}
            </Row>
          </div>
        </Col>
      </Row>
    </Layout>
  );
}

export default Profile;
