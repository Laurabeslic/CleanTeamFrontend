import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, Dropdown, ButtonGroup } from "react-bootstrap";
import Table from "../../components/Table";
import StatisticsWidget from "../widgets/StatisticsWidget";
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import CreateForm from "./CreateKundeForm";
import { FiMoreVertical } from 'react-icons/fi';

const Kunden = () => {
    const [totalKunden, setTotalKunden] = useState(0);
    const [kundenData, setKundenData] = useState<any[]>([]);
    const [editedKunde, setEditedKunde] = useState<any>(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);

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
        },
        {
            Header: "",
            accessor: "actions",
            Cell: ({ row }: { row: { original: { id: string } } }) => (
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                  <FiMoreVertical />
                </Dropdown.Toggle>
        
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleEditKunde(row.original)}>Bearbeiten</Dropdown.Item> 
                  <Dropdown.Item>Löschen</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ),
          },
    ];

    useEffect(() => {

        fetchKunden();
    }, []);

    const fetchKunden = async () => {
        try {
            const response = await axios.get("http://localhost:3001/kunde/");
            const formattedData = response.data.map((customer: any) => ({
                KundenID: customer.KundenID,
                Name: customer.Name,
                Adresse: customer.Adresse,
                Telefon: customer.Telefon,
                Email: customer.Email
            }));

            setTotalKunden(formattedData.length);
            setKundenData(formattedData);
        } catch (error) {
            console.error("Es gab einen Fehler beim Abrufen der Kunden:", error);
        }
      };

    const handleCreateCustomer = async (newKundeData: any) => {
        try {
            
            const response = await axios.post("http://localhost:3001/Kunde/", newKundeData);
            setIsCreateFormOpen(false);
            await fetchKunden();
          } catch (error) {
            console.error("Fehler beim Erstellen des Auftrags:", error);
          }
      };

      const handleEditKunde = (kunde: any) => {
        setEditedKunde(kunde);
        setIsEditFormOpen(true);
      };

    const openCreateForm = () => {
        setIsCreateFormOpen(true);
      };

      const closeCreateForm = () => {
        setIsCreateFormOpen(false);
      };

    return (
        <>
            <br></br>
            <Row>
                <Col sm={6} xl={4}>
                    <StatisticsWidget
                        variant="primary"
                        title="Kunden"
                        stats={totalKunden.toString()}
                        icon="users" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                    <div className="row" style={{ marginLeft: "1050px", marginTop: "15px" }}>
                        <div className="col-md-2 mb-3">
                        <button className="btn btn-primary" onClick={openCreateForm}>
                          <FiPlus size={20} />
                        </button>
                        </div>
                    </div>
                        <Card.Body>
                            <Table
                                columns={columns}
                                data={kundenData}
                                pageSize={5}
                                sizePerPageList={[{ text: "5", value: 5 }, { text: "10", value: 10 }, { text: "25", value: 25 }, { text: "All", value: kundenData.length }]}
                                isSortable={true}
                                pagination={true}
                                isSearchable={true} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <CreateForm isOpen={isCreateFormOpen} onCreate={handleCreateCustomer} onClose={closeCreateForm} />
        </>
    );
};

export default Kunden;