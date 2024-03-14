
import React, { useState, useEffect } from "react";
import { FiMoreVertical } from 'react-icons/fi';
import { FiPlus } from 'react-icons/fi';
import axios from "axios";
import Table from "../../components/Table";
import StatisticsWidget from "../widgets/StatisticsWidget";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import CreateForm from "./CreateFirmenwagenForm"; 
import EditForm from "./EditFirmenwagenForm";
import AusleiheForm from "./NeueAusleiheForm";
import { Row, Col, Card, Dropdown, ButtonGroup} from "react-bootstrap";
import FeatherIcons from "feather-icons-react";
import DeleteConfirmationModal from './../customers/DeleteConfirmationModal';
import SuccessMessage from "../Messages/SuccessMessage";
import DeleteMessage from "../Messages/DeleteMessage";



import { Link, useLocation } from 'react-router-dom';

interface AusleihhistorieEntry {
  Ausleiher: string;
  Ausleihdatum: string;
  Rückgabedatum: string | null;
}


function useQuery() {
    return new URLSearchParams(useLocation().search);
}
 
  
  const Firmenwaegen = () => {
    const loggedInUser = useSelector((state: RootState) => state.Auth.user);
    const query = useQuery();
    const searchValue = query.get("search") || "";
    const [totalWagen, setTotalWagen] = useState(0);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [editedWagen, setEditedWagen] = useState<any>(null);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isAusleiheFormOpen, setIsAusleiheFormOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [wagenData, setWagenData] = useState<any[]>([]);
    const [mitarbeiterData, setMitarbeiterData] = useState<any[]>([]);
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
        Header: "ID",
        accessor: "id",
        sort: true,
        Cell: ({ value }: { value: string }) => <Link to={`/cars/${value}`}>{value}</Link>
  
      },
      {
        Header: "Kennzeichen",
        accessor: "kennzeichen",
        sort: true
      },
      {
        Header: "Marke",
        accessor: "marke",
        sort: true,
      },
      {
        Header: "Modell",
        accessor: "modell",
        sort: false,
      },
      {
        Header: "Farbe",
        accessor: "farbe",
        sort: false,
      },
      {
          Header: "Kraftstoffart",
          accessor: "kraftstoffart",
          sort: false,
        },
        {
            Header: "Letzte Wartung",
            accessor: "letzteWartung",
            sort: false,
          },
          {
            Header: "Aktueller Status",
            accessor: "ausgeliehenAn",
            sort: false,
            Cell: ({ row }: { row: { original: { ausleihhistorie: any[] } } }) => {
                const ausleihhistorie = row.original.ausleihhistorie;
                const ausgeliehenAn = ausleihhistorie.find((history: any) => history.Rückgabedatum === null);
                if (ausgeliehenAn) {
                    const ausleiherID = ausgeliehenAn.Ausleiher;
                    const mitarbeiter = mitarbeiterData.find((mitarbeiter: any) => mitarbeiter.MitarbeiterID === ausleiherID);
                    return mitarbeiter ? `Ausgeliehen von ${mitarbeiter.Name.split(' ')[1]}` : 'Frei';
                } else {
                    return 'Frei';
                }
            }
        },
        {
          Header: "",
          accessor: "actions",
          Cell: ({ row }: { row: { original: { ausleihhistorie: any[] } } }) => {
            const ausleihhistorie = row.original.ausleihhistorie;
            const ausgeliehenAn = ausleihhistorie.find((history: any) => history.Rückgabedatum === null);
            const isVehicleAvailable = !ausgeliehenAn;
            return (
              isAdmin && (
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                    <FiMoreVertical />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEditWagen(row.original)}>Bearbeiten</Dropdown.Item> 
                    <Dropdown.Item onClick={() => handleDeleteWagen(row.original)}>Löschen</Dropdown.Item>
                    {isVehicleAvailable && <Dropdown.Divider />}
                    {isVehicleAvailable && <Dropdown.Item onClick={() => handleAusleihe(row.original)}>Neue Ausleihe</Dropdown.Item>}
          
                  </Dropdown.Menu>
                </Dropdown>
              )
            );
          },
        },
    ];

    const getCurrentStatus = (ausleihhistorie: any[]) => {
      const currentRental = ausleihhistorie.find((rental: any) => !rental.Rückgabedatum);
      return currentRental ? `Ausgeliehen von ${currentRental.Ausleiher}` : "Frei";
    };

    const handleEditWagen = (wagen: any) => {
      setEditedWagen(wagen);
      setIsEditFormOpen(true);
    };

    const handleDeleteWagen = (wagen: any) => {
      setEditedWagen(wagen); 
      setIsDelete(true);
    };

    const handleAusleihe = (wagen: any) => {
      setEditedWagen(wagen); 
      setIsAusleiheFormOpen(true);
    };
    
    console.log(wagenData);

    useEffect(() => {

            try {

                 fetchWaegen();
                 fetchMitarbeiter();
                console.log(wagenData);
            } catch (error) {
                console.error("Es gab einen Fehler beim Abrufen der Autos:", error);
            }
    }, [searchValue]);


    const updateMyData = (rowIndex: number, columnId: string, value: any) => {
        setWagenData(old => {
            const updatedData = old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    };
                }
                return row;
            });
    
            
            setTotalWagen(updatedData.length);
            return updatedData;
        });
    };
    
    const fetchWaegen = async () => {
      try {
        const response = await axios.get("http://localhost:3001/firmenwagen/");
        let formattedData = response.data.map((wagen: any) => ({
            id: wagen.FirmenwagenID,
            kennzeichen: wagen.Kennzeichen,
            modell: wagen.Modell,
            baujahr: wagen.Baujahr,
            letzteWartung: new Date(wagen.LetzteWartung).toLocaleDateString(),
            farbe: wagen.Farbe,
            kraftstoffart: wagen.Kraftstoffart,
            marke: wagen.Marke,
            kilometerstand: wagen.Kilometerstand,
            tankvolumen: wagen.Tankvolumen,
            ausleihhistorie: wagen.Ausleihhistorie
        }));
        setTotalWagen(formattedData.length);

        setWagenData(formattedData);
    } catch (error) {
        console.error("Es gab einen Fehler beim Abrufen der Autos:", error);
    }
      };

      const fetchMitarbeiter = async () => {
        try {
            const response = await axios.get("http://localhost:3001/Mitarbeiter/");
            setMitarbeiterData(response.data);
        } catch (error) {
            console.error("Es gab einen Fehler beim Abrufen der Mitarbeiter:", error);
        }
    };

    const handleCreateFirmenwagen = async (newFirmenwagenData: any) => {
        try {
         
          const response = await axios.post("http://localhost:3001/Firmenwagen/", newFirmenwagenData);
        
          setIsCreateFormOpen(false);
          setShowSuccessMessage(true)
          await fetchWaegen();
        } catch (error) {
          console.error("Fehler beim Erstellen des Wagens:", error);
        }
      };

      const handleUpdateWagen = async (FirmenwagenID:string, updatedWagen: {
        LetzteWartung: string;
        Kilometerstand: number;
        Ausleihhistorie: AusleihhistorieEntry[];
      }) => {
        try {
          console.log('FirmendwagenId:', FirmenwagenID);
          console.log('updatedData:', updatedWagen);
          // Sende die aktualisierten Daten an den Server, um den Auftrag zu aktualisieren
          await axios.put(`http://localhost:3001/Firmenwagen/${FirmenwagenID}`, updatedWagen);
      
          // Aktualisiere die Auftragsdaten und schließe das Bearbeitungsmodal
          await fetchWaegen();
          setIsEditFormOpen(false);
          setShowUpdateMessage(true);
        } catch (error) {
          console.error('Fehler beim Aktualisieren des Wagens:', error);
        }
      };
      
      const handleDeleteConfirmed = async () => {
        try {
          if (editedWagen) {
            const response = await axios.delete(`http://localhost:3001/Firmenwagen/${editedWagen.id}`);
            console.log('Wagen gelöscht:', response.data);
            await fetchWaegen();
            setShowDeleteMessage(true);
          }
        } catch (error) {
          console.error('Fehler beim Löschen des Wagens:', error);
        } finally {
          setIsDelete(false);
          setEditedWagen(null);
        }
      };
      const handleCreateAusleihe = async (FirmenwagenID:string, updatedAusleihhistorie: AusleihhistorieEntry[]) => {
        try {
          const response = await axios.get(`http://localhost:3001/firmenwagen/${FirmenwagenID}`);
          const updatedWagen = { ...response.data, Ausleihhistorie: updatedAusleihhistorie };
          await axios.put(`http://localhost:3001/firmenwagen/${FirmenwagenID}`, updatedWagen);
          setIsAusleiheFormOpen(false);
          await fetchWaegen();
        } catch (error) {
          console.error("Fehler beim Erstellen der Ausleihe:", error);
        }
      };
      
      

      const openCreateForm = () => {
        setIsCreateFormOpen(true);
      };
    
      const closeCreateForm = () => {
        setIsCreateFormOpen(false);
      };
      const closeCreateAusleiheForm = () => {
        setIsAusleiheFormOpen(false);
      };


    return (
    
        <>
        <br></br>
        <Row>
        <Col sm={6} xl={4}>
          <StatisticsWidget
            variant="primary"
            title="Firmenwägen"
            stats={totalWagen.toString()}
            icon="list" />
        </Col>
      </Row>
        <Row>
                <Col>
                    <Card>
                    <div className="d-flex justify-content-end mb-3 mt-2" style={{marginRight: "45px"}}>

                      <div>
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
                                data={wagenData}
                                pageSize={5}
                                sizePerPageList={[{ text: "5", value: 5 }, { text: "10", value: 10 }, { text: "25", value: 25 }, { text: "All", value: wagenData.length }]}
                                isSortable={true}
                                pagination={true}
                                isSearchable={true}
                                updateMyData={updateMyData} />

                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <SuccessMessage // Anzeige der Erfolgsmeldungskomponente
          show={showSuccessMessage}
          onHide={() => setShowSuccessMessage(false)}
          nachricht= "Firmenwagen erfolgreich hinzugefügt"
        />
         <SuccessMessage // Anzeige der Erfolgsmeldungskomponente
          show={showUpdateMessage}
          onHide={() => setShowUpdateMessage(false)}
          nachricht= "Änderungen gespeichert"
        />
        <DeleteMessage // Anzeige der Erfolgsmeldungskomponente
          show={showDeleteMessage}
          onHide={() => setShowDeleteMessage(false)}
          nachricht= "Firmenwagen gelöscht"
        />
  
        <CreateForm isOpen={isCreateFormOpen} onCreate={handleCreateFirmenwagen} onClose={closeCreateForm} />
    
        <EditForm isOpen={isEditFormOpen} editedWagen={editedWagen} onUpdate={handleUpdateWagen} onClose={() => setIsEditFormOpen(false)} />
      

      <DeleteConfirmationModal
          isOpen={isDelete}
          onRequestClose={() => setIsDelete(false)}
          onDeleteConfirmed={handleDeleteConfirmed}
          isDeleteConfirmation={isDelete}
          art = "Wagen"
        />

      <AusleiheForm editedWagen={editedWagen} isOpen={isAusleiheFormOpen} onUpdate={handleCreateAusleihe} onClose={closeCreateAusleiheForm} />
       </>
    );
};


export default Firmenwaegen;