import React, { useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface AusleihhistorieEntry {
  Ausleiher: string;
  Ausleihdatum: string;
  Rückgabedatum: string | null;
}

interface FirmenwagenDetailProps {
  ausleihhistorie: AusleihhistorieEntry[];
}

const AusleihhistorieTable: React.FC<FirmenwagenDetailProps> = ({ ausleihhistorie }) => {
  const [showAll, setShowAll] = useState(false);

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  let filteredAusleihhistorie = ausleihhistorie.filter(entry => {
    if (!showAll) {
      const entryMonth = new Date(entry.Ausleihdatum).toLocaleString('default', { month: 'long' });
      return entryMonth === currentMonth;
    }
    return true;
  });

  // Umkehrung der Reihenfolge für die Anzeige der neuesten Einträge oben
  filteredAusleihhistorie = filteredAusleihhistorie.reverse();

  const handleShowAll = () => {
    setShowAll(true);
  };

  return (
    <Card>
      <Card.Body>
        <h5 className="card-title mt-0 mb-0 header-title">
          Ausleihhistorie {showAll ? '' : ` - ${currentMonth}`}
        </h5>

        <div className="table-responsive mt-4">
          <table className="table table-hover table-nowrap mb-0">
            <thead>
              <tr>
                <th scope="col">Ausleiher</th>
                <th scope="col">Ausleihdatum</th>
                <th scope="col">Rückgabedatum</th>
              </tr>
            </thead>
            <tbody>
              {filteredAusleihhistorie.map((entry, index) => (
                <tr key={index}>
                 <td>
                    <Link to={`/employees/${entry.Ausleiher}`}>{entry.Ausleiher}</Link>
                  </td>
                  <td>{new Date(entry.Ausleihdatum).toLocaleDateString()}</td>
                  <td>
                    {entry.Rückgabedatum
                      ? new Date(entry.Rückgabedatum).toLocaleDateString()
                      : 'Noch nicht zurückgegeben'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!showAll && (
          <Row className="justify-content-end">
            <Col xs="auto">
              <Button variant="primary" onClick={handleShowAll} className="mt-3">
                Alle anzeigen
              </Button>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default AusleihhistorieTable;
