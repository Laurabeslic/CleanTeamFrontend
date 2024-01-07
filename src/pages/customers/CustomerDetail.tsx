import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import OverViewItem from "../../components/OverViewItem";
import { Badge, Card, Col, Row } from 'react-bootstrap';
import { WithMarkers } from '../maps/GoogleMaps';
import { GoogleApiWrapper } from 'google-maps-react';
import Statistics from "../apps/Projects/Detail/Statistics";

interface CustomerDetailType {
    _id: string;
    KundenID: string;
    Name: string;
    Adresse: {
        Strasse: string;
        Stadt: string;
        PLZ: number;
        Land: string;
    };
    Telefon: string;
    Email: string;
    Vertraege: string[];
    __v: number;
}

interface VertragType {
    VertragID: string;
    KundenID: string;
    Details: string;
    Gueltigkeitsdatum: Date;
    Auftraege: string[];
}

function CustomerDetail({ match, google }: any) {
    const { kundenId } = useParams();
    const [customer, setCustomer] = useState<CustomerDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [contracts, setContracts] = useState<VertragType[]>([]);


    console.log('KundenID: ' + kundenId);

    useEffect(() => {
        async function fetchCustomerDetail() {
            try {
                const response = await axios.get(`http://localhost:3001/kunde/${kundenId}`);
                setCustomer(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching customer details:", error);
                setLoading(false);
            }
        }

        fetchCustomerDetail();
    }, [kundenId]);

    useEffect(() => {
        async function fetchContracts() {
            try {
                const response = await axios.get(`http://localhost:3001/vertrag/kunde/${kundenId}`);
                setContracts(response.data);
            } catch (error) {
                console.error("Error fetching contracts:", error);
            }
        }

        fetchContracts();
    }, [kundenId]);

    if (loading) return <div>Loading...</div>;
    if (!customer) return <div>Customer not found.</div>;

    return (
        <>
            <br></br>
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body className="p-0">
                            <h6 className="card-title border-bottom p-3 mb-0 header-title">
                                Kunden Details    <span className="me-1"></span> 
                                <Badge bg="info" className="fs-13 fw-normal me-1">
                                    {customer.KundenID}
                                </Badge>
                            </h6>
                            <Row className="py-1">
                                <Col md={6} xl={4}>
                                    <Statistics
                                        icon="user"
                                        stats={customer.Name}
                                        description="Name"
                                    />
                                </Col>
                                <Col sm={6} xl={3}>
                                    <Statistics
                                        icon="phone"
                                        stats={customer.Telefon}
                                        description="Telefon"
                                    />
                                </Col>
                                <Col sm={6} xl={5}>
                                    <Statistics
                                        icon="mail"
                                        stats={customer.Email}
                                        description="Email"
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
                            <h6 className="mt-0 header-title">Verträge</h6>
                            <div className="text-muted mt-3">
                                {contracts.map((contract, index) => (
                                    <div key={index}>
                                        <strong>ID:</strong> {contract.VertragID}<br />
                                        <strong>Details:</strong> {contract.Details}<br />
                                        <strong>Gültigkeitsdatum:</strong> {new Date(contract.Gueltigkeitsdatum).toLocaleDateString()}<br />
                                        <strong>Anzahl der Aufträge:</strong> 
                                        <Link to={`/orders?search=${customer.KundenID}`}>
                                {contract.Auftraege.length}
                            </Link>
                                        
                                        <br /><br />
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <WithMarkers google={google} address={customer.Adresse.Strasse + ', ' + customer.Adresse.PLZ + ' ' + customer.Adresse.Stadt} />
                </Col>
            </Row>
        </>
    );
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyALlcpZRjnDaMJwx2kAcSyqpyVSLYEeb44",
})(CustomerDetail);
