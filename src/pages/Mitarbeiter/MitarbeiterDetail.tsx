import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import OverViewItem from "../../components/OverViewItem";
import { Badge, Card, Col, Row } from 'react-bootstrap';
import { WithMarkers } from '../maps/GoogleMaps';
import { GoogleApiWrapper } from 'google-maps-react';
import Statistics from "../apps/Projects/Detail/Statistics";
import { BiBriefcase } from 'react-icons/bi';

interface MitarbeiterDetailType {
    MitarbeiterID: string;
    Name: string,
    Telefon: string,
    Position: string,
    Adresse: {
      Strasse: string,
      Stadt: string,
      PLZ: string,
      Land: string,
    },
    Faehigkeiten : [],
}

function MitarbeiterDetail({ match, google }: any) {
    const { mitarbeiterId } = useParams();
    const [mitarbeiter, setMitarbeiter] = useState<MitarbeiterDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [anzahlAuftraege, setAnzahlAuftraege] = useState<{ [vertragID: string]: number }>({});



    console.log('KundenID: ' + mitarbeiterId);

    useEffect(() => {
        async function fetchMitarbeiterDetail() {
            try {
                const response = await axios.get(`http://localhost:3001/mitarbeiter/${mitarbeiterId}`);
                setMitarbeiter(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching customer details:", error);
                setLoading(false);
            }
        }

        fetchMitarbeiterDetail();
    }, [mitarbeiterId]);



    if (loading) return <div>Loading...</div>;
    if (!mitarbeiter) return <div>Employee not found.</div>;
      
  

    return (
        <>
            <br></br>
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body className="p-0">
                            <h6 className="card-title border-bottom p-3 mb-0 header-title">
                                Mitarbeiter Details    <span className="me-1"></span> 
                                <Badge bg="info" className="fs-13 fw-normal me-1">
                                    {mitarbeiter.MitarbeiterID}
                                </Badge>
                            </h6>
                            <Row className="py-1">
                                <Col md={6} xl={4}>
                                    <Statistics
                                        icon="user"
                                        stats={mitarbeiter.Name}
                                        description="Name"
                                    />
                                </Col>
                                <Col sm={6} xl={3}>
                                    <Statistics
                                        icon="phone"
                                        stats={mitarbeiter.Telefon}
                                        description="Telefon"
                                    />
                                </Col>
                                <Col sm={6} xl={5}>
                                    <Statistics
                                        icon="briefcase" 
                                        stats={mitarbeiter.Position}
                                        description="Position"
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
            <Col lg={6}>
                    <Card>
                        <Card.Body>
                            <h6 className="mt-0 header-title">Fähigkeiten</h6>
                            <tr className="mt-3 pt-2 border-top">
                        <td>
                          {mitarbeiter.Faehigkeiten.map((skill: string, index: number) => (
                            <span key={index} className="badge badge-soft-primary me-1">
                              {skill}
                            </span>
                          ))}
                        </td>
                      </tr>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <WithMarkers google={google} address={mitarbeiter.Adresse.Strasse + ', ' + mitarbeiter.Adresse.PLZ + ' ' + mitarbeiter.Adresse.Stadt} />
                </Col>
            </Row>
        </>
    );
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyALlcpZRjnDaMJwx2kAcSyqpyVSLYEeb44",
})(MitarbeiterDetail);
