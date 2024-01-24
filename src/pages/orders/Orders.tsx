
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card } from "react-bootstrap";
import Table from "../../components/Table";
import StatisticsWidget from "../widgets/StatisticsWidget";
import CreateOrderForm from "./CreateOrderForm"; // Importiere das Auftragsformular
import CustomModal from './OrderModal';
import DatePicker from "react-datepicker";



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

const columns = [
    {
      Header: "ID",
      accessor: "id",
      sort: true,
      Cell: ({ value }: { value: string }) => <Link to={`/orders/${value}`}>{value}</Link>

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
  ];const Orders = () => {
    const query = useQuery();
    const searchValue = query.get("search") || "";
    const [totalOrders, setTotalOrders] = useState(0);
    const [inProgressOrders, setInProgressOrders] = useState(0);
    const [completedOrders, setCompletedOrders] = useState(0);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

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
        async function fetchOrders() {
            try {
                const response = await axios.get("http://localhost:3001/auftrag/");
                let formattedData = response.data.map((order: any) => ({
                    id: order.AuftragsID,
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

                setTotalOrders(formattedData.length);
                setInProgressOrders(formattedData.filter((order: { status: string; }) => order.status === "In Bearbeitung").length);
                setCompletedOrders(formattedData.filter((order: { status: string; }) => order.status === "Abgeschlossen").length);

                setOrdersData(formattedData);
            } catch (error) {
                console.error("Es gab einen Fehler beim Abrufen der Aufträge:", error);
            }
        }

        fetchOrders();
    }, [searchValue]);
    

    const handleCreateOrder = async (newOrderData: any) => {
        try {
          // Sende die Daten an den Server, um einen neuen Auftrag zu erstellen
          const response = await axios.post("http://localhost:3001/Auftrag/", newOrderData);
          const createdOrder = response.data;
    
          // Aktualisiere die Auftragsliste mit dem neuen Auftrag
          setOrdersData((prevOrders) => [...prevOrders, createdOrder]);
    
          // Aktualisiere die Zähler
          recalculateOrderCounts();

          setIsCreateFormOpen(false);
        } catch (error) {
          console.error("Fehler beim Erstellen des Auftrags:", error);
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
                    <Col md="auto" style={{ marginLeft: "1000px", marginTop: "15px" }}>
                    <button className="btn btn-primary" onClick={openCreateForm}>
                        Auftrag erstellen
                    </button>
                     </Col>
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
            <CustomModal isOpen={isCreateFormOpen} onRequestClose={closeCreateForm}>
        {/* Hier füge dein Formular oder den Inhalt des Modals ein */}
        <CreateOrderForm isOpen={isCreateFormOpen} onCreate={handleCreateOrder} onClose={closeCreateForm} />
      </CustomModal>
            </>
    );
};


export default Orders;