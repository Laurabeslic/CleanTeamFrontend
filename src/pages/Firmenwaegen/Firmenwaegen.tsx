
import React, { useState, useEffect } from "react";
import { FiMoreVertical } from 'react-icons/fi';
import { FiPlus } from 'react-icons/fi';
import axios from "axios";
import Table from "../../components/Table";
import StatisticsWidget from "../widgets/StatisticsWidget";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
// import CreateForm from "./CreateAuftragForm"; // Importiere das Auftragsformular
// import EditForm from "./EditAuftragForm";
import { Row, Col, Card, Dropdown, ButtonGroup} from "react-bootstrap";
import FeatherIcons from "feather-icons-react";
import DeleteConfirmationModal from './../customers/DeleteConfirmationModal';



import { Link, useLocation } from 'react-router-dom';



function useQuery() {
    return new URLSearchParams(useLocation().search);
}
 
  
  const Firmenwaegen = () => {
    const loggedInUser = useSelector((state: RootState) => state.Auth.user);
    const query = useQuery();
    const searchValue = query.get("search") || "";
    const [totalWagen, setTotalWagen] = useState(0);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [editedOrder, setEditedOrder] = useState<any>(null);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [wagenData, setWagenData] = useState<any[]>([]);
    const [mitarbeiterData, setMitarbeiterData] = useState<any[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);

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
          Cell: ({ row }: { row: { original: { id: string } } }) => (
           isAdmin && ( 
           <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                <FiMoreVertical />
              </Dropdown.Toggle>
      
              <Dropdown.Menu>
                <Dropdown.Item >Bearbeiten</Dropdown.Item> 
                <Dropdown.Item >Löschen</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>)
          ),
        },
    ];

    const getCurrentStatus = (ausleihhistorie: any[]) => {
      const currentRental = ausleihhistorie.find((rental: any) => !rental.Rückgabedatum);
      return currentRental ? `Ausgeliehen von ${currentRental.Ausleiher}` : "Frei";
    };

    const handleEditOrder = (order: any) => {
      setEditedOrder(order);
      setIsEditFormOpen(true);
    };

    const handleDeleteOrder = (order: any) => {
      setEditedOrder(order); // Setze den zu löschenden Auftrag für die Bestätigung
      setIsDelete(true);
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

    // const handleCreateOrder = async (newOrderData: any) => {
    //     try {
    //       // Sende die Daten an den Server, um einen neuen Auftrag zu erstellen
    //       const response = await axios.post("http://localhost:3001/Auftrag/", newOrderData);
    //       //const createdOrder = response.data;
          
    //       // Aktualisiere die Zähler
    //       recalculateOrderCounts();

    //       setIsCreateFormOpen(false);
    //       await fetchOrders();
    //     } catch (error) {
    //       console.error("Fehler beim Erstellen des Auftrags:", error);
    //     }
    //   };

    //   const handleUpdateOrder = async (orderId: string, updatedData: { Details: string; Status: string; Adresse: { Strasse: string; PLZ: string; Stadt: string; Land: string } }) => {
    //     try {
    //       console.log('orderId:', orderId);
    //       console.log('updatedData:', updatedData);
    //       // Sende die aktualisierten Daten an den Server, um den Auftrag zu aktualisieren
    //       await axios.put(`http://localhost:3001/Auftrag/${orderId}`, updatedData);
      
    //       // Aktualisiere die Auftragsdaten und schließe das Bearbeitungsmodal
    //       await fetchOrders();
    //       setIsEditFormOpen(false);
    //     } catch (error) {
    //       console.error('Fehler beim Aktualisieren des Auftrags:', error);
    //     }
    //   };
      
    //   const handleDeleteConfirmed = async () => {
    //     try {
    //       if (editedOrder) {
    //         const response = await axios.delete(`http://localhost:3001/Auftrag/${editedOrder.id}`);
    //         console.log('Auftrag gelöscht:', response.data);
      
    //         // Hier kannst du weitere Aktualisierungen vornehmen, falls nötig
    //         // Zum Beispiel: Aktualisiere die Anzeige der Aufträge
    //         await fetchOrders();
    //       }
    //     } catch (error) {
    //       console.error('Fehler beim Löschen des Auftrags:', error);
    //     } finally {
    //       setIsDelete(false);
    //       setEditedOrder(null);
    //     }
    //   };
      

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
            title="Firmenwägen"
            stats={totalWagen.toString()}
            icon="list" />
        </Col>
      </Row>
        <Row>
                <Col>
                    <Card>
                    <div className="row" style={{ marginLeft: "1050px", marginTop: "15px" }}>

                      <div className="col-md-8 mb-3">
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
  
        {/* <CreateForm isOpen={isCreateFormOpen} onCreate={handleCreateOrder} onClose={closeCreateForm} />
    
        <EditForm isOpen={isEditFormOpen} editedOrder={editedOrder} onUpdate={handleUpdateOrder} onClose={() => setIsEditFormOpen(false)} />
      

      <DeleteConfirmationModal
          isOpen={isDelete}
          onRequestClose={() => setIsDelete(false)}
          onDeleteConfirmed={handleDeleteConfirmed}
          isDeleteConfirmation={isDelete}
          art = "Auftrag"
        /> */}
       </>
    );
};


export default Firmenwaegen;