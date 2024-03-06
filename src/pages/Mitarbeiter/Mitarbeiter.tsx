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
// import EditForm from "./EditKundeForm";
import DeleteConfirmationModal from './../customers/DeleteConfirmationModal';
import { FiMoreVertical } from 'react-icons/fi';

const Employees = () => {
    const loggedInUser = useSelector((state: RootState) => state.Auth.user);

    const [totalEmployees, setTotalEmployees] = useState(0);
    const [employeesData, setEmployeesData] = useState<any[]>([]);
    const [editedEmployee, setEditedEmployee] = useState<any>(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

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
                    Adresse: employee.Adresse ? employee.Adresse : {}
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
            await fetchEmployees();
          } catch (error) {
            console.error("Fehler beim Erstellen des Mitarbeiters:", error);
          }
      };


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

      const handleDeleteConfirmed = async () => {
        try {
          if (editedEmployee) {
            const response = await axios.delete(`http://localhost:3001/Mitarbeiter/${editedEmployee.MitarbeiterID}`);
            console.log('Mitarbeiter gelöscht:', response.data);
      
            await fetchEmployees();
          }
        } catch (error) {
          console.error('Fehler beim Löschen des Mitarbeiters:', error);
        } finally {
          setIsDelete(false);
          setEditedEmployee(null);
        }
      };

      const handleEditEmployee = (employee: any) => {
        setEditedEmployee(employee);
        setIsEditFormOpen(true);
      };

      const handleDeleteEmployee = (employee: any) => {
        setEditedEmployee(employee);
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
                    <div className="row" style={{ marginLeft: "1050px", marginTop: "15px" }}>
                        <div className="col-md-2 mb-3">
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

            <CreateForm isOpen={isCreateFormOpen} onCreate={handleCreateMitarbeiter} onClose={closeCreateForm} />
            
            {/* <CreateVertragForm editedKunde={editedKunde} isOpen={isCreateVertragFormOpen} onCreate={handleCreateVertrag} onClose={closeCreateVertragForm} />

            <EditForm isOpen={isEditFormOpen} editedKunde={editedKunde} onUpdate={handleUpdateKunde} onClose={() => setIsEditFormOpen(false)} /> */}
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