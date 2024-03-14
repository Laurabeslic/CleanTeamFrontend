import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, Dropdown, ButtonGroup } from "react-bootstrap";
import Table from "../../components/Table";
import StatisticsWidget from "../widgets/StatisticsWidget";
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import CreateForm from "./CreateMitarbeiterForm";
// import CreateVertragForm from "./CreateVertragForm";
import EditForm from "./EditMitarbeiterForm";
import DeleteConfirmationModal from './../customers/DeleteConfirmationModal';
import { FiMoreVertical } from 'react-icons/fi';
import SuccessMessage from "../Messages/SuccessMessage";
import DeleteMessage from "../Messages/DeleteMessage";

const Employees = () => {
    const loggedInUser = useSelector((state: RootState) => state.Auth.user);

    const [totalEmployees, setTotalEmployees] = useState(0);
    const [employeesData, setEmployeesData] = useState<any[]>([]);
    const [editedMitarbeiter, setEditedMitarbeiter] = useState<any>(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showDeleteMessage, setShowDeleteMessage] = useState(false);
    const [showUpdateMessage, setShowUpdateMessage] = useState(false);

    useEffect(() => {
    
        if(loggedInUser.user.role === "Admin"){
            setIsAdmin(true);
        }
      }, [loggedInUser]);

    const columns = [
        {
            Header: "MitarbeiterID",
            accessor: "MitarbeiterID",
            sort: true,
            Cell: ({ value }: { value: string }) => <Link to={`/employees/${value}`}>{value}</Link>
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
            Header: "Position",
            accessor: "Position",
            sort: false,
        },
        {
          Header: "UserID",
          accessor: "UserID",
          sort: false,
      },
        {
            Header: "",
            accessor: "actions",
            Cell: ({ row }: { row: { original: { id: string } } }) => (
             isAdmin && ( 
             <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                  <FiMoreVertical />
                </Dropdown.Toggle>
        
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleEditEmployee(row.original)}>Bearbeiten</Dropdown.Item> 
                  <Dropdown.Item onClick={() => handleDeleteEmployee(row.original)}>Löschen</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>)
            ),
          },
    ];

    useEffect(() => {

        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get("http://localhost:3001/mitarbeiter/");
            const formattedData = response.data.map((employee: any) => {
                const formattedEmployee = {
                    MitarbeiterID: employee.MitarbeiterID,
                    Name: employee.Name,
                    Telefon: employee.Telefon,
                    Position: employee.Position,
                    Faehigkeiten: employee.Faehigkeiten,
                    Schichtplan: employee.Schichtplan,
                    Adresse: employee.Adresse ? employee.Adresse : {},
                    UserID: employee.UserID
                };
                return formattedEmployee;
            });

            setTotalEmployees(formattedData.length);
            setEmployeesData(formattedData);
            console.log(employeesData);
        } catch (error) {
            console.error("Es gab einen Fehler beim Abrufen der Mitarbeiter:", error);
        }
      };

    const handleCreateMitarbeiter = async (newMitarbeiterData: any) => {
        try {
            
            const response = await axios.post("http://localhost:3001/Mitarbeiter/", newMitarbeiterData);
            setIsCreateFormOpen(false);
            setShowSuccessMessage(true)
            await fetchEmployees();
          } catch (error) {
            console.error("Fehler beim Erstellen des Mitarbeiters:", error);
          }
      };


      const handleUpdateMitarbeiter = async (MitarbeiterId: string, updatedData: { Name: string; Telefon: string; Position: string;Adresse: { Strasse: string; PLZ: string; Stadt: string; Land: string } }) => {
        try {
            console.log('mitarbeiterId:', MitarbeiterId);
            console.log('updatedData:', updatedData);
            
            await axios.put(`http://localhost:3001/Mitarbeiter/${MitarbeiterId}`, updatedData);
        
          
            await fetchEmployees();
            setIsEditFormOpen(false);
            setShowUpdateMessage(true);
          } catch (error) {
            console.error('Fehler beim Aktualisieren des Mitarbeiters:', error);
          }
      };

      const handleDeleteConfirmed = async () => {
        try {
          if (editedMitarbeiter) {
            const response = await axios.delete(`http://localhost:3001/Mitarbeiter/${editedMitarbeiter.MitarbeiterID}`);
            console.log('Mitarbeiter gelöscht:', response.data);
      
            await fetchEmployees();
            setShowDeleteMessage(true);
          }
        } catch (error) {
          console.error('Fehler beim Löschen des Mitarbeiters:', error);
        } finally {
          setIsDelete(false);
          setEditedMitarbeiter(null);
        }
      };

      const handleEditEmployee = (employee: any) => {
        setEditedMitarbeiter(employee);
        setIsEditFormOpen(true);
      };

      const handleDeleteEmployee = (employee: any) => {
        setEditedMitarbeiter(employee);
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
                        title="Mitarbeiter"
                        stats={totalEmployees.toString()}
                        icon="users" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                    <div className="d-flex justify-content-end mb-3 mt-2" style={{marginRight: "40px"}}>
                        <div >
                        {isAdmin && (
                        <button className="btn btn-primary" onClick={openCreateForm} >
                          <FiPlus size={20} />
                        </button>
                        )}
                        </div>
                    </div>
                        <Card.Body>
                            <Table
                                columns={columns}
                                data={employeesData}
                                pageSize={5}
                                sizePerPageList={[{ text: "5", value: 5 }, { text: "10", value: 10 }, { text: "25", value: 25 }, { text: "All", value: employeesData.length }]}
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
          nachricht= "Mitarbeiter erfolgreich hinzugefügt"
        />
        <SuccessMessage // Anzeige der Erfolgsmeldungskomponente
          show={showUpdateMessage}
          onHide={() => setShowUpdateMessage(false)}
          nachricht= "Änderungen gespeichert"
        />
        <DeleteMessage // Anzeige der Erfolgsmeldungskomponente
          show={showDeleteMessage}
          onHide={() => setShowDeleteMessage(false)}
          nachricht= "Mitarbeiter gelöscht"
        />
            <CreateForm isOpen={isCreateFormOpen} onCreate={handleCreateMitarbeiter} onClose={closeCreateForm} />

            <EditForm isOpen={isEditFormOpen} editedMitarbeiter={editedMitarbeiter} onUpdate={handleUpdateMitarbeiter} onClose={() => setIsEditFormOpen(false)} />
            <DeleteConfirmationModal
                isOpen={isDelete}
                onRequestClose={() => setIsDelete(false)}
                onDeleteConfirmed={handleDeleteConfirmed}
                isDeleteConfirmation={isDelete}
                art = "Mitarbeiter"
             />
        </>
    );
};

export default Employees;