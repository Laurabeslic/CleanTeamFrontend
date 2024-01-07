import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card } from "react-bootstrap";
import Table from "../../components/Table";
import StatisticsWidget from "../widgets/StatisticsWidget";
import { Link } from 'react-router-dom';

const columns = [
    {
        Header: "KundenID",
        accessor: "KundenID",
        sort: true,
        Cell: ({ value }: { value: string }) => <Link to={`/customers/${value}`}>{value}</Link>
    },
    {
        Header: "Name",
        accessor: "Name",
        sort: true,
    },
    {
        Header: "Adresse",
        accessor: "Adresse",
        Cell: ({ value }: { value: any }) => `${value.Strasse}, ${value.PLZ} ${value.Stadt}, ${value.Land}`,
        sort: false,
    },
    {
        Header: "Telefon",
        accessor: "Telefon",
        sort: false,
    },
    {
        Header: "Email",
        accessor: "Email",
        sort: false,
    }
];

const Customers = () => {
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [customersData, setCustomersData] = useState<any[]>([]);

    useEffect(() => {
        async function fetchCustomers() {
            try {
                const response = await axios.get("http://localhost:3001/kunde/");
                const formattedData = response.data.map((customer: any) => ({
                    KundenID: customer.KundenID,
                    Name: customer.Name,
                    Adresse: customer.Adresse,
                    Telefon: customer.Telefon,
                    Email: customer.Email
                }));

                setTotalCustomers(formattedData.length);
                setCustomersData(formattedData);
            } catch (error) {
                console.error("Es gab einen Fehler beim Abrufen der Kunden:", error);
            }
        }

        fetchCustomers();
    }, []);

    return (
        <>
            <br></br>
            <Row>
                <Col sm={6} xl={4}>
                    <StatisticsWidget
                        variant="primary"
                        title="Kunden"
                        stats={totalCustomers.toString()}
                        icon="users" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Table
                                columns={columns}
                                data={customersData}
                                pageSize={5}
                                sizePerPageList={[{ text: "5", value: 5 }, { text: "10", value: 10 }, { text: "25", value: 25 }, { text: "All", value: customersData.length }]}
                                isSortable={true}
                                pagination={true}
                                isSearchable={true} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Customers;