import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import classNames from "classnames";
import axios from "axios";

interface OrderDetails {
  AuftragsID: string;
  Auftragsart: string;
  KundenID: string;
  Status: string;
  Datum: string;
}

const Orders = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);

  useEffect(() => {
    // Auftragsdaten vom Server abrufen
    const fetchOrders = async () => {
      try {
        const response = await axios.get<OrderDetails[]>("http://localhost:3001/auftrag");
        setOrderDetails(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Filtere die Aufträge, die in der Zukunft liegen oder heute bzw. in der Vergangenheit stattgefunden haben
  const relevantOrders = orderDetails.filter(
    (item) => new Date(item.Datum).getTime() <= new Date().getTime()
  );

  // Sortiere die relevanten Aufträge nach dem Datum, um die neuesten zuerst zu erhalten
  const sortedOrders = relevantOrders.sort(
    (a, b) => new Date(b.Datum).getTime() - new Date(a.Datum).getTime()
  );

  // Nimm die ersten fünf Aufträge (oder weniger, wenn es weniger als fünf gibt)
  const latestOrders = sortedOrders.slice(0, 5);

  return (
    <Card>
      <Card.Body>
        <h5 className="card-title mt-0 mb-0 header-title">Letzte Aufträge</h5>

        <div className="table-responsive mt-4">
          <table className="table table-hover table-nowrap mb-0">
            <thead>
              <tr>
                <th scope="col">Auftrag</th>
                <th scope="col">Art</th>
                <th scope="col">Kunde</th>
                <th scope="col">Status</th>
                <th scope="col">Datum</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((item, index) => (
                <tr key={index}>
                  <td>
                  <Link to={`/orders/${item.AuftragsID}`}>{item.AuftragsID}</Link>
                  </td>
                  <td>{item.Auftragsart}</td>
                  <td>
                    <Link to={`/customers/${item.KundenID}`}>{item.KundenID}</Link>
                    </td>
                  <td>
                    <span
                      className={classNames("badge", "py-1", {
                        "badge-soft-warning": item.Status === "In Bearbeitung",
                        "badge-soft-success": item.Status === "Abgeschlossen",
                        "badge-soft-danger": item.Status === "Storniert",
                      })}
                    >
                      {item.Status}
                    </span>
                  </td>
                  <td>{new Date(item.Datum).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Orders;
