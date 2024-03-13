import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import OverViewItem from "../../components/OverViewItem";
import { Badge, Card, Col, Row } from 'react-bootstrap';
import { WithMarkers } from '../maps/GoogleMaps';
import { GoogleApiWrapper } from 'google-maps-react';
import Statistics from "../apps/Projects/Detail/Statistics";
import { BiBriefcase } from 'react-icons/bi';
import AusleihhistorieTable from './AusleihhistorieOverview';

interface AusleihhistorieEntry {
    Ausleiher: string;
    Ausleihdatum: string;
    Rückgabedatum: string | null;
  }

interface FirmenwagenDetailType {
    FirmenwagenID: string,
    Kennzeichen: string,
    Modell: string,
    Baujahr: number,
    LetzteWartung: Date,
    Farbe: string,
    Kraftstoffart: string,
    Marke: string,
    Kilometerstand: number,
    Tankvolumen: number,
    Ausleihhistorie: AusleihhistorieEntry[]
}

function FirmenwagenDetail({ match, google }: any) {
    const { firmenwagenId } = useParams();
    const [firmenwagen, setFirmenwagen] = useState<FirmenwagenDetailType | null>(null);
    const [loading, setLoading] = useState(true);

    console.log('FirmenwagenID: ' + firmenwagenId);

    useEffect(() => {
        async function fetchFirmenwagenDetail() {
            try {
                const response = await axios.get(`http://localhost:3001/firmenwagen/${firmenwagenId}`);
                setFirmenwagen(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching car details:", error);
                setLoading(false);
            }
        }

        fetchFirmenwagenDetail();
    }, [firmenwagenId]);



    if (loading) return <div>Loading...</div>;
    if (!firmenwagen) return <div>Employee not found.</div>;
      
  

    return (
        <>
            <br></br>
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body className="p-0">
                            <h6 className="card-title border-bottom p-3 mb-0 header-title">
                                Firmenwagen Details    <span className="me-1"></span> 
                                <Badge bg="info" className="fs-13 fw-normal me-1">
                                    {firmenwagen.FirmenwagenID}
                                </Badge>
                            </h6>
                            <Row className="py-1">
                                <Col md={6} xl={4}>
                                    <Statistics
                                        icon="truck"
                                        stats={firmenwagen.Kennzeichen}
                                        description="Kennzeichen"
                                    />
                                </Col>
                                <Col sm={6} xl={3}>
                                    <Statistics
                                        icon="square"
                                        stats={firmenwagen.Marke}
                                        description="Marke"
                                    />
                                </Col>
                                <Col sm={6} xl={5}>
                                    <Statistics
                                        icon="menu" 
                                        stats={firmenwagen.Modell}
                                        description="Modell"
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
                        <AusleihhistorieTable ausleihhistorie={firmenwagen.Ausleihhistorie} />

                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                <Card>
                        <Card.Body>
                        <h6 className="mt-0 header-title mb-3">Weitere Informationen</h6>
                            <div className="details-section">
                              
                                <p><strong>Baujahr:</strong> {firmenwagen.Baujahr}</p>
                                <p><strong>Letzte Wartung:</strong> {new Date(firmenwagen.LetzteWartung).toLocaleDateString()}</p>
                                <p><strong>Farbe:</strong> {firmenwagen.Farbe}</p>
                                <p><strong>Kilometerstand:</strong> {firmenwagen.Kilometerstand}</p>
                                <p><strong>Tankvolumen:</strong> {firmenwagen.Tankvolumen}</p>
                                <p><strong>Kraftstoffart:</strong> {firmenwagen.Kraftstoffart}</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyALlcpZRjnDaMJwx2kAcSyqpyVSLYEeb44",
})(FirmenwagenDetail);
