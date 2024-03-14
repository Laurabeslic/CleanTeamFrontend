import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, Dropdown} from "react-bootstrap";
import Table from "../../components/Table";
import StatisticsWidget from "../widgets/StatisticsWidget";
import { Link , useLocation } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import CreateForm from "./CreateSchluesselForm";
import EditForm from "./EditSchluesselForm";
import DeleteConfirmationModal from '../customers/DeleteConfirmationModal';
import { FiMoreVertical } from 'react-icons/fi';
import SuccessMessage from "../Messages/SuccessMessage";


function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Schluessel = () => {
    const query = useQuery();
    const searchValue = query.get("search") || "";
    const [totalSchluessel, setTotalSchluessel] = useState(0);
    const [schluesselData, setSchluesselData] = useState<any[]>([]);
    const [editedSchluessel, setEditedSchluessel] = useState<any>(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isCreateVertragFormOpen, setIsCreateVertragFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
                  <Dropdown.Item onClick={() => handleEditSchluessel(row.original)}>Bearbeiten</Dropdown.Item> 
                 
                  <Dropdown.Item onClick={() => handleDeleteSchluessel(row.original)}>Löschen</Dropdown.Item>
                 
                </Dropdown.Menu>
              </Dropdown>
            ),
          },
    ];

    useEffect(() => {

        fetchSchluessel();
    }, [searchValue, selectedDate]);

    const fetchSchluessel = async () => {
        try {
            const response = await axios.get("http://localhost:3001/auftrag/schluessel");
            let formattedData = response.data.map((key: any) => ({
                Schlüsselcode: key.Schlüsselcode,
                Schlüsseltyp: key.Schlüsseltyp,
                Zustand: key.Zustand,
                Verantwortlicher: key.VerantwortlicherMitarbeiter,
                Auftrag: key.AuftragsID,
                Übergabedatum: new Date(key.Übergabedatum).toLocaleDateString()
            }));

            if (searchValue) {
                formattedData = formattedData.filter((schluessel: { Auftrag: string | string[]; }) => schluessel.Auftrag.includes(searchValue));
            }
            if (selectedDate) {
                formattedData = formattedData.filter((schluessel: { Übergabedatum: string }) => schluessel.Übergabedatum === new Date(selectedDate).toLocaleDateString());
              }
            setTotalSchluessel(formattedData.length);
            setSchluesselData(formattedData);
        } catch (error) {
            console.error("Es gab einen Fehler beim Abrufen der Schlüssel:", error);
        }
      };

    const handleCreateSchluessel = async (newSchluesselData: any) => {
        try {
            console.log(newSchluesselData);
           const response = await axios.post(`http://localhost:3001/auftrag/${newSchluesselData.AuftragsID}/schluessel`, newSchluesselData);
            setIsCreateFormOpen(false);
            setShowSuccessMessage(true)
            await fetchSchluessel();
          } catch (error) {
            console.error("Fehler beim Erstellen des Schlüssels:", error);
          }
      };

      const handleUpdateSchluessel = async (orderId: string, newSchluesselData: any) => {
        try {
            console.log('orderId:', orderId);
            console.log('updatedSchlüssel:', newSchluesselData);
            const dataToSend = { Schlüssel: newSchluesselData };
            
            await axios.put(`http://localhost:3001/auftrag/${orderId}`, dataToSend);
          
            await fetchSchluessel();
            setIsEditFormOpen(false);
          } catch (error) {
            console.error('Fehler beim Aktualisieren des Schlüssels:', error);
          }
      };

      const handleDeleteConfirmed = async () => {
        try {
          if (editedSchluessel) {
            const dataToSend = { auftragsID: editedSchluessel.Auftrag, schlüsselcode: editedSchluessel.Schlüsselcode };
            console.log(dataToSend);
            const response = await axios.post(`http://localhost:3001/auftrag/schluessel/delete`, dataToSend);
            console.log('Schlüssel gelöscht:', response.data);
            await fetchSchluessel();
          }
        } catch (error) {
          console.error('Fehler beim Löschen des Schlüssels:', error);
        } finally {
          setIsDelete(false);
          setEditedSchluessel(null);
        }
      };

      const handleEditSchluessel = (schluessel: any) => {
        setEditedSchluessel(schluessel);
        setIsEditFormOpen(true);
      };

      const handleDeleteSchluessel = (schluessel: any) => {
        setEditedSchluessel(schluessel);
        setIsDelete(true);
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
                        title="Schlüssel"
                        stats={totalSchluessel.toString()}
                        icon="lock" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                    <div className="d-flex justify-content-end mb-3 mt-2" style={{marginRight: "60px"}}>
                    <input
                            id="dateFilter"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="form-control me-2"
                            style={{ maxWidth: "200px" }} // Beschränke die Breite des Datumsfelds, um Überlappungen zu vermeiden
                          />

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
            <SuccessMessage // Anzeige der Erfolgsmeldungskomponente
          show={showSuccessMessage}
          onHide={() => setShowSuccessMessage(false)}
          nachricht= "Schlüssel erfolgreich hinzugefügt"
        />
            <CreateForm isOpen={isCreateFormOpen} onCreate={handleCreateSchluessel} onClose={closeCreateForm} />
        

            <EditForm isOpen={isEditFormOpen} editedSchluessel={editedSchluessel} onUpdate={handleUpdateSchluessel} onClose={() => setIsEditFormOpen(false)}/>
            <DeleteConfirmationModal
                isOpen={isDelete}
                onRequestClose={() => setIsDelete(false)}
                onDeleteConfirmed={handleDeleteConfirmed}
                isDeleteConfirmation={isDelete}
                art="Schlüssel"
             />
        </>
    );
};

export default Schluessel;