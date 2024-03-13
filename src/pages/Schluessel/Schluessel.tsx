import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, Dropdown} from "react-bootstrap";
import Table from "../../components/Table";
import StatisticsWidget from "../widgets/StatisticsWidget";
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
//import CreateForm from "./CreateKundeForm";
//import CreateVertragForm from "./CreateVertragForm";
//import EditForm from "./EditKundeForm";
//import DeleteConfirmationModal from './DeleteConfirmationModal';
import { FiMoreVertical } from 'react-icons/fi';

const Schluessel = () => {
    const [totalSchluessel, setTotalSchluessel] = useState(0);
    const [schluesselData, setSchluesselData] = useState<any[]>([]);
    const [editedSchluessel, setEditedSchluessel] = useState<any>(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isCreateVertragFormOpen, setIsCreateVertragFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);

    const columns = [
        {
            Header: "Schlüsselcode",
            accessor: "Schlüsselcode",
            sort: true,
        },
        {
            Header: "Schlüsseltyp",
            accessor: "Schlüsseltyp",
            sort: true,
        },
        {
            Header: "Zustand",
            accessor: "Zustand",
            sort: false,
        },
        {
            Header: "Übergabedatum",
            accessor: "Übergabedatum",
            sort: false,
        },
        {
            Header: "Verantwortlicher",
            accessor: "Verantwortlicher",
            sort: false,
            Cell: ({ value }: { value: string }) => <Link to={`/employees/${value}`}>{value}</Link>
        },
        {
            Header: "Auftrag",
            accessor: "Auftrag",
            sort: false,
            Cell: ({ value }: { value: string }) => <Link to={`/orders/${value}`}>{value}</Link>
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
                  <Dropdown.Item >Bearbeiten</Dropdown.Item> 
                  {/* onClick={() => handleEditKunde(row.original)} */}
                  <Dropdown.Item >Löschen</Dropdown.Item>
                  {/* onClick={() => handleDeleteKunde(row.original)} */}
                  <Dropdown.Divider />
                  <Dropdown.Item>Vertrag erstellen</Dropdown.Item>
                  {/* onClick={() => handleVertrag(row.original)} */}
                </Dropdown.Menu>
              </Dropdown>
            ),
          },
    ];

    useEffect(() => {

        fetchSchluessel();
    }, []);

    const fetchSchluessel = async () => {
        try {
            const response = await axios.get("http://localhost:3001/auftrag/schluessel");
            const formattedData = response.data.map((key: any) => ({
                Schlüsselcode: key.Schlüsselcode,
                Schlüsseltyp: key.Schlüsseltyp,
                Zustand: key.Zustand,
                Verantwortlicher: key.VerantwortlicherMitarbeiter,
                Auftrag: key.AuftragsID,
                Übergabedatum: new Date(key.Übergabedatum).toLocaleDateString()
            }));

            setTotalSchluessel(formattedData.length);
            setSchluesselData(formattedData);
        } catch (error) {
            console.error("Es gab einen Fehler beim Abrufen der Schlüssel:", error);
        }
      };

    // const handleCreateCustomer = async (newKundeData: any) => {
    //     try {
            
    //         const response = await axios.post("http://localhost:3001/Kunde/", newKundeData);
    //         setIsCreateFormOpen(false);
    //         await fetchKunden();
    //       } catch (error) {
    //         console.error("Fehler beim Erstellen des Kunden:", error);
    //       }
    //   };

    //   const handleCreateVertrag = async (newVertragData: any) => {
    //     try {
            
    //         const response = await axios.post("http://localhost:3001/Vertrag/", newVertragData);
    //         setIsCreateVertragFormOpen(false);
    //         await fetchKunden();
    //       } catch (error) {
    //         console.error("Fehler beim Erstellen des Vertrages:", error);
    //       }
        
    //   };

    //   const handleUpdateKunde = async (kundenId: string, updatedData: { Name: string; Telefon: string; Email: string;Adresse: { Strasse: string; PLZ: string; Stadt: string; Land: string } }) => {
    //     try {
    //         console.log('kundenId:', kundenId);
    //         console.log('updatedData:', updatedData);
            
    //         await axios.put(`http://localhost:3001/Kunde/${kundenId}`, updatedData);
        
          
    //         await fetchKunden();
    //         setIsEditFormOpen(false);
    //       } catch (error) {
    //         console.error('Fehler beim Aktualisieren des Kunden:', error);
    //       }
    //   };

    //   const handleDeleteConfirmed = async () => {
    //     try {
    //       if (editedKunde) {
    //         const response = await axios.delete(`http://localhost:3001/Kunde/${editedKunde.KundenID}`);
    //         console.log('Kunde gelöscht:', response.data);
      
    //         await fetchKunden();
    //       }
    //     } catch (error) {
    //       console.error('Fehler beim Löschen des Kunden:', error);
    //     } finally {
    //       setIsDelete(false);
    //       setEditedKunde(null);
    //     }
    //   };

    //   const handleEditKunde = (kunde: any) => {
    //     setEditedKunde(kunde);
    //     setIsEditFormOpen(true);
    //   };

    //   const handleDeleteKunde = (kunde: any) => {
    //     setEditedKunde(kunde);
    //     setIsDelete(true);
    //   };
    //   const handleVertrag = (kunde: any) => {
    //     setEditedKunde(kunde); 
    //     setIsCreateVertragFormOpen(true);
    //   };

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
                        title="Schlüssel"
                        stats={totalSchluessel.toString()}
                        icon="lock" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                    <div className="d-flex justify-content-end mb-3 mt-2" style={{marginRight: "50px"}}>
                       
                        <button className="btn btn-primary" onClick={openCreateForm}>
                          <FiPlus size={20} />
                        </button>
                        
                    </div>
                        <Card.Body>
                            <Table
                                columns={columns}
                                data={schluesselData}
                                pageSize={5}
                                sizePerPageList={[{ text: "5", value: 5 }, { text: "10", value: 10 }, { text: "25", value: 25 }, { text: "All", value: schluesselData.length }]}
                                isSortable={true}
                                pagination={true}
                                isSearchable={true} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <CreateForm isOpen={isCreateFormOpen} onCreate={handleCreateCustomer} onClose={closeCreateForm} />
            
            <CreateVertragForm editedKunde={editedKunde} isOpen={isCreateVertragFormOpen} onCreate={handleCreateVertrag} onClose={closeCreateVertragForm} />

            <EditForm isOpen={isEditFormOpen} editedKunde={editedKunde} onUpdate={handleUpdateKunde} onClose={() => setIsEditFormOpen(false)} />
            <DeleteConfirmationModal
                isOpen={isDelete}
                onRequestClose={() => setIsDelete(false)}
                onDeleteConfirmed={handleDeleteConfirmed}
                isDeleteConfirmation={isDelete}
                art="Kunde"
             /> */}
        </>
    );
};

export default Schluessel;