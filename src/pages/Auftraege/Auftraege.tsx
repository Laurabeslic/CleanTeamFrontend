
import React, { useState, useEffect } from "react";
import { FiMoreVertical } from 'react-icons/fi';
import { FiPlus } from 'react-icons/fi';
import axios from "axios";
import Table from "../../components/Table";
import StatisticsWidget from "../widgets/StatisticsWidget";
import CreateForm from "./CreateAuftragForm"; // Importiere das Auftragsformular
import EditForm from "./EditAuftragForm";
import { Row, Col, Card, Dropdown, ButtonGroup} from "react-bootstrap";
import FeatherIcons from "feather-icons-react";
import DeleteConfirmationModal from './DeleteConfirmationModal';



import { Link, useLocation } from 'react-router-dom';



function useQuery() {
    return new URLSearchParams(useLocation().search);
}



const StatusDropdown = ({ value, onChange }: { value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => (
    <select className="form-select" value={value} onChange={onChange}>
        <option value="Abgeschlossen">Abgeschlossen</option>
        <option value="In Bearbeitung">In Bearbeitung</option>
    </select>
);

const updateAuftragStatus = async (auftragsID: string, newStatus: string) => {
    try {
        console.log('New Status: '+ newStatus)
        await axios.patch(`http://localhost:3001/auftrag/${auftragsID}/status`, { status: newStatus });
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Auftragsstatus:", error);
    }
};


  
  
  const Orders = () => {
    const query = useQuery();
    const searchValue = query.get("search") || "";
    const [totalOrders, setTotalOrders] = useState(0);
    const [inProgressOrders, setInProgressOrders] = useState(0);
    const [completedOrders, setCompletedOrders] = useState(0);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [editedOrder, setEditedOrder] = useState<any>(null);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedDate, setSelectedDate] = useState('');




    const columns = [
      {
        Header: "ID",
        accessor: "id",
        sort: true,
        Cell: ({ value }: { value: string }) => <Link to={`/orders/${value}`}>{value}</Link>
  
      },
      {
        Header: "Auftragsart",
        accessor: "auftragsart",
        sort: true
      },
      {
        Header: "Details",
        accessor: "details",
        sort: true,
      },
      {
        Header: "Kunde",
        accessor: "kunde",
        sort: false,
      },
      {
          Header: "Status",
          accessor: "status",
          Cell: ({ row, updateMyData }: { row: { index: number, original: { status: string, id: string } }, updateMyData: (rowIndex: number, columnId: string, value: any) => void }) => {
              console.log(row.original); // <-- Dies hinzufügen
              return (
                  <StatusDropdown 
                      value={row.original.status} 
                      onChange={e => {
                          updateMyData(row.index, 'status', e.target.value);
                          updateAuftragStatus(row.original.id, e.target.value);
                          
                      }}
                  />
              );
          },
          
          sort: true,
      },
      {
        Header: "Datum",
        accessor: "datum",
        sort: false,
      },
      {
          Header: "Vetrag",
          accessor: "vertrag",
          sort: false,
        },
        {
          Header: "Verantwortlicher",
          accessor: "verantwortlicher",
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
                <Dropdown.Item onClick={() => handleEditOrder(row.original)}>Bearbeiten</Dropdown.Item> 
                <Dropdown.Item onClick={() => handleDeleteOrder(row.original)}>Löschen</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ),
        },
    ];

    const handleStatusChange = (status : string) => {
       setSelectedStatus(status);
       console.log(selectedStatus);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       setSelectedDate(e.target.value);
    };



    const handleEditOrder = (order: any) => {
      setEditedOrder(order);
      setIsEditFormOpen(true);
    };

    const handleDeleteOrder = (order: any) => {
      setEditedOrder(order); // Setze den zu löschenden Auftrag für die Bestätigung
      setIsDelete(true);
    };
    


    const [ordersData, setOrdersData] = useState<any[]>([]);
    console.log(ordersData);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await axios.get("http://localhost:3001/auftrag/");
                const formattedData = response.data.map((order: any) => ({
                    id: order.AuftragsID,
                    details: order.Details,
                    kunde: order.KundenID,
                    status: order.Status,
                    datum: new Date(order.Datum).toLocaleDateString(),
                    vertrag: order.VertragID,
                    verantwortlicher: order.UserID
                }));

                setTotalOrders(formattedData.length);
                setInProgressOrders(formattedData.filter((order: { status: string; }) => order.status === "In Bearbeitung").length);
                setCompletedOrders(formattedData.filter((order: { status: string; }) => order.status === "Abgeschlossen").length);

                    
                setOrdersData(formattedData);
            } catch (error) {
                console.error("Es gab einen Fehler beim Abrufen der Aufträge:", error);
            }
        }

        fetchOrders();
    }, []);

    const recalculateOrderCounts = () => {
        setTotalOrders(ordersData.length);
        setInProgressOrders(ordersData.filter(order => order.status === "In Bearbeitung").length);
        setCompletedOrders(ordersData.filter(order => order.status === "Abgeschlossen").length);
    };

    const updateMyData = (rowIndex: number, columnId: string, value: any) => {
        setOrdersData(old => {
            const updatedData = old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    };
                }
                return row;
            });
    
            // Verwenden Sie updatedData, um die Zähler direkt neu zu berechnen
            setTotalOrders(updatedData.length);
            setInProgressOrders(updatedData.filter(order => order.status === "In Bearbeitung").length);
            setCompletedOrders(updatedData.filter(order => order.status === "Abgeschlossen").length);
    
            return updatedData;
        });
    };

    useEffect(() => {
        fetchOrders();
    }, [searchValue, selectedStatus, selectedDate]);
    
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auftrag/");
        let formattedData = response.data.map((order: any) => ({
            id: order.AuftragsID,
            auftragsart: order.Auftragsart,
            details: order.Details,
            kunde: order.KundenID,
            status: order.Status,
            datum: new Date(order.Datum).toLocaleDateString(),
            vertrag: order.VertragID,
            verantwortlicher: order.UserID
        }));

        if (searchValue) {
            formattedData = formattedData.filter((order: { kunde: string | string[]; }) => order.kunde.includes(searchValue));
        }

         // Filterung nach Status
        if (selectedStatus) {
          formattedData = formattedData.filter((order: { status: string }) => order.status === selectedStatus);
        }

        // Filterung nach Datum (angenommen, das Datum ist ein String)
        if (selectedDate) {
          formattedData = formattedData.filter((order: { datum: string }) => order.datum === new Date(selectedDate).toLocaleDateString());
        }

        setTotalOrders(formattedData.length);
        setInProgressOrders(formattedData.filter((order: { status: string; }) => order.status === "In Bearbeitung").length);
        setCompletedOrders(formattedData.filter((order: { status: string; }) => order.status === "Abgeschlossen").length);

        setOrdersData(formattedData);
    } catch (error) {
        console.error("Es gab einen Fehler beim Abrufen der Aufträge:", error);
    }
      };

    const handleCreateOrder = async (newOrderData: any) => {
        try {
          // Sende die Daten an den Server, um einen neuen Auftrag zu erstellen
          const response = await axios.post("http://localhost:3001/Auftrag/", newOrderData);
          //const createdOrder = response.data;
          
          // Aktualisiere die Zähler
          recalculateOrderCounts();

          setIsCreateFormOpen(false);
          await fetchOrders();
        } catch (error) {
          console.error("Fehler beim Erstellen des Auftrags:", error);
        }
      };

      const handleUpdateOrder = async (orderId: string, updatedData: { Details: string; Status: string; Adresse: { Strasse: string; PLZ: string; Stadt: string; Land: string } }) => {
        try {
          console.log('orderId:', orderId);
          console.log('updatedData:', updatedData);
          // Sende die aktualisierten Daten an den Server, um den Auftrag zu aktualisieren
          await axios.put(`http://localhost:3001/Auftrag/${orderId}`, updatedData);
      
          // Aktualisiere die Auftragsdaten und schließe das Bearbeitungsmodal
          await fetchOrders();
          setIsEditFormOpen(false);
        } catch (error) {
          console.error('Fehler beim Aktualisieren des Auftrags:', error);
        }
      };
      
      const handleDeleteConfirmed = async () => {
        try {
          if (editedOrder) {
            const response = await axios.delete(`http://localhost:3001/Auftrag/${editedOrder.id}`);
            console.log('Auftrag gelöscht:', response.data);
      
            // Hier kannst du weitere Aktualisierungen vornehmen, falls nötig
            // Zum Beispiel: Aktualisiere die Anzeige der Aufträge
            await fetchOrders();
          }
        } catch (error) {
          console.error('Fehler beim Löschen des Auftrags:', error);
        } finally {
          setIsDelete(false);
          setEditedOrder(null);
        }
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
            title="Aufträge"
            stats={totalOrders.toString()}
            icon="list" />
        </Col>
        <Col sm={6} xl={4}>
          <StatisticsWidget
            variant="warning"
            title="In Bearbeitung"
            stats={inProgressOrders.toString()}
            icon="clock" />
        </Col>
        <Col sm={6} xl={4}>
          <StatisticsWidget
            variant="success"
            title="Abgeschlossen"
            stats={completedOrders.toString()}
            icon="check-circle" />
        </Col>
      </Row>
        <Row>
                <Col>
                    <Card>
                    <div className="row" style={{ marginLeft: "690px", marginTop: "15px" }}>
                    <Dropdown as={ButtonGroup} className="col-md-4 mb-3">
                      <Dropdown.Toggle variant="primary" className="cursor-pointer" > {selectedStatus || 'Status'}
                        <i className="icon">
                          <span>
                            <FeatherIcons icon="chevron-down"></FeatherIcons>
                          </span>
                        </i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleStatusChange('')}>Alle</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleStatusChange('Abgeschlossen')}>Abgeschlossen</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleStatusChange('In Bearbeitung')}>In Bearbeitung</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                      
                      <div className="col-md-5 mb-3">
      
                        <input
                          id="dateFilter"
                          type="date"
                          value={selectedDate}
                          onChange={handleDateChange}
                          className="form-control"
                        />
                      </div>

                      <div className="col-md-2 mb-3">
                        <button className="btn btn-primary" onClick={openCreateForm}>
                          <FiPlus size={20} />
                        </button>
                      </div>
                    </div>

                        <Card.Body>
                    
                            <Table
                                columns={columns}
                                data={ordersData}
                                pageSize={5}
                                sizePerPageList={[{ text: "5", value: 5 }, { text: "10", value: 10 }, { text: "25", value: 25 }, { text: "All", value: ordersData.length }]}
                                isSortable={true}
                                pagination={true}
                                isSearchable={true}
                                updateMyData={updateMyData} />

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
  
        <CreateForm isOpen={isCreateFormOpen} onCreate={handleCreateOrder} onClose={closeCreateForm} />
    
        <EditForm isOpen={isEditFormOpen} editedOrder={editedOrder} onUpdate={handleUpdateOrder} onClose={() => setIsEditFormOpen(false)} />
      

      <DeleteConfirmationModal
          isOpen={isDelete}
          onRequestClose={() => setIsDelete(false)}
          onDeleteConfirmed={handleDeleteConfirmed}
          isDeleteConfirmation={isDelete}
        />
       </>
    );
};


export default Orders;