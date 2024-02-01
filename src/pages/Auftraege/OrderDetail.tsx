import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import OverViewItem from "../../components/OverViewItem";
import { Badge, Button, ButtonGroup, Card, Col, Dropdown, Row } from 'react-bootstrap';
import { WithMarkers } from '../maps/GoogleMaps';
import { GoogleApiWrapper } from 'google-maps-react';
import Statistics from "../apps/Projects/Detail/Statistics";



interface OrderDetailType {
    _id: string;
    AuftragsID: string;
    KundenID: string;
    UserID: string;
    Datum: string;
    Status: string;
    Details: string;
    VertragID: string;
    __v: number;
    Adresse: {
        Strasse: string;
        Stadt: string;
        PLZ: number;
        Land: string;
    };
}

interface CustomerDetailType{
    
        KundenID: string,
        Name: string,
        Telefon: string,
        Email: string,
        Adresse: {
          Strasse: string,
          Stadt: string,
          PLZ: string,
          Land: string,
        };
}


const StatusDropdown = ({ value, onChange }: { value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => (
    <select className="form-select" value={value} onChange={onChange}>
        <option value="Abgeschlossen">Abgeschlossen</option>
        <option value="In Bearbeitung">In Bearbeitung</option>
    </select>
);

const updateAuftragStatus = async (auftragsID: string, newStatus: string) => {
    try {
        console.log('New Status: ' + newStatus)
        await axios.patch(`http://localhost:3001/auftrag/${auftragsID}/status`, { status: newStatus });
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Auftragsstatus:", error);
    }
};


function OrderDetail({ match, google }: any) {
    const { auftragId } = useParams();
    const [order, setOrder] = useState<OrderDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [Kunde, setKunde] = useState<CustomerDetailType | null>(null);

    console.log('AuftragsID: ' + auftragId)

    useEffect(() => {
        async function fetchOrderDetail() {
            try {
                const response = await axios.get(`http://localhost:3001/auftrag/${auftragId}`);
                setOrder(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching order details:", error);
                setLoading(false);
            }
        }

        fetchOrderDetail();
    }, [auftragId]);

    useEffect(() => {
        async function fetchKunde() {
            try {
                const response = await axios.get(`http://localhost:3001/kunde/${order?.KundenID}`);
                setKunde(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching customer:", error);
                setLoading(false);
            }
        }

        fetchKunde();
    }, [order]);


    if (loading) return <div>Loading...</div>;
    if (!order) return <div>Order not found.</div>;

    // Render order details

    return (
        <>
            <br></br>



            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body className="p-0">
                            <h6 className="card-title border-bottom p-3 mb-0 header-title">
                                Auftrags Details     <span className="me-1"></span>

                                <Badge bg="info" className=" fs-13 fw-normal me-1">
                                    {order.AuftragsID}
                                </Badge>
                                {order.Status === 'In Bearbeitung' ? (
                                    <Badge bg="warning" className=" fs-13 fw-normal me-1">
                                        {order.Status}
                                    </Badge>
                                ) : (
                                    <Badge bg="success" className="fs-13 fw-normal me-1">
                                        {order.Status}
                                    </Badge>
                                )}

                            </h6>

                            <Row className="py-1">
                                <Col md={6} xl={4}>
                                    <Statistics
                                        icon="users"
                                        stats={Kunde ? Kunde.Name : "Kunde nicht gefunden"}
                                        description="Kunde"
                                    />
                                </Col>
                                <Col sm={6} xl={4}>
                                    <Statistics
                                        icon="file-text"
                                        stats={order.VertragID}
                                        description="Vertrag"
                                    />
                                </Col>
                                <Col sm={6} xl={4}>
                                    <Statistics
                                        icon="calendar"
                                        stats={new Date(order.Datum).toLocaleDateString('de-DE')}
                                        description="Datum"
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
                            <h6 className="mt-0 header-title">About Project</h6>

                            <div className="text-muted mt-3">
                                {order.Details}
                            </div>

                            <br></br>
                            <StatusDropdown 
                                value={order.Status} 
                                onChange={e => {
                                    const newStatus = e.target.value;
                                    setOrder(prevOrder => {
                                        if (prevOrder) {
                                            return {
                                                ...prevOrder,
                                                Status: newStatus
                                            };
                                        }
                                        return prevOrder;
                                    });
                                    updateAuftragStatus(order.AuftragsID, newStatus);
                                }}
                            />

                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={6}>
                    <WithMarkers google={google} address={order.Adresse.Strasse + ', ' + order.Adresse.PLZ + ' ' + order.Adresse.Stadt} />
                </Col>
            </Row>
                                        


        </>
    );
}


export default GoogleApiWrapper({
    apiKey: "AIzaSyALlcpZRjnDaMJwx2kAcSyqpyVSLYEeb44",
})(OrderDetail);