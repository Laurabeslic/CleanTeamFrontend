import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, Dropdown, ButtonGroup } from "react-bootstrap";
import Table from "../../components/Table";
import StatisticsWidget from "../widgets/StatisticsWidget";
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import CreateForm from "./CreateKundeForm";
import CreateVertragForm from "./CreateVertragForm";
import EditForm from "./EditKundeForm";
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { FiMoreVertical } from 'react-icons/fi';

const Kunden = () => {
    const [totalKunden, setTotalKunden] = useState(0);
    const [kundenData, setKundenData] = useState<any[]>([]);
    const [editedKunde, setEditedKunde] = useState<any>(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isCreateVertragFormOpen, setIsCreateVertragFormOpen] = useState(false);
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
                  <Dropdown.Item onClick={() => handleDeleteKunde(row.original)}>Löschen</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => handleVertrag(row.original)}>Vertrag erstellen</Dropdown.Item>
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
            console.error("Fehler beim Erstellen des Kunden:", error);
          }
      };

      const handleCreateVertrag = async (newVertragData: any) => {
        try {
            
            const response = await axios.post("http://localhost:3001/Vertrag/", newVertragData);
            setIsCreateVertragFormOpen(false);
            await fetchKunden();
          } catch (error) {
            console.error("Fehler beim Erstellen des Vertrages:", error);
          }
        
      };

      const handleUpdateKunde = async (kundenId: string, updatedData: { Name: string; Telefon: string; Email: string;Adresse: { Strasse: string; PLZ: string; Stadt: string; Land: string } }) => {
        try {
            console.log('kundenId:', kundenId);
            console.log('updatedData:', updatedData);
            
            await axios.put(`http://localhost:3001/Kunde/${kundenId}`, updatedData);
        
          
            await fetchKunden();
            setIsEditFormOpen(false);
          } catch (error) {
            console.error('Fehler beim Aktualisieren des Kunden:', error);
          }
      };

      const handleDeleteConfirmed = async () => {
        try {
          if (editedKunde) {
            const response = await axios.delete(`http://localhost:3001/Kunde/${editedKunde.KundenID}`);
            console.log('Kunde gelöscht:', response.data);
      
            await fetchKunden();
          }
        } catch (error) {
          console.error('Fehler beim Löschen des Kunden:', error);
        } finally {
          setIsDelete(false);
          setEditedKunde(null);
        }
      };

      const handleEditKunde = (kunde: any) => {
        setEditedKunde(kunde);
        setIsEditFormOpen(true);
      };

      const handleDeleteKunde = (kunde: any) => {
        setEditedKunde(kunde);
        setIsDelete(true);
      };
      const handleVertrag = (kunde: any) => {
        setEditedKunde(kunde); 
        setIsCreateVertragFormOpen(true);
      };

    const openCreateForm = () => {
        setIsCreateFormOpen(true);
      };

      const closeCreateForm = () => {
        setIsCreateFormOpen(false);
      };

      const closeCreateVertragForm = () => {
        setIsCreateVertragFormOpen(false);
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
            
            <CreateVertragForm editedKunde={editedKunde} isOpen={isCreateVertragFormOpen} onCreate={handleCreateVertrag} onClose={closeCreateVertragForm} />

            <EditForm isOpen={isEditFormOpen} editedKunde={editedKunde} onUpdate={handleUpdateKunde} onClose={() => setIsEditFormOpen(false)} />
            <DeleteConfirmationModal
                isOpen={isDelete}
                onRequestClose={() => setIsDelete(false)}
                onDeleteConfirmed={handleDeleteConfirmed}
                isDeleteConfirmation={isDelete}
             />
        </>
    );
};

export default Kunden;