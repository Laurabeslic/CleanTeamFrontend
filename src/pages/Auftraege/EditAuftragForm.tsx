import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import {Button, Modal } from "react-bootstrap";

interface EditOrderFormProps {
  editedOrder: {
    id: string;
    details: string;
    kunde: string;
    status: string;
    datum: string;
    vertrag: string;
    verantwortlicher: string;
  };
  isOpen: boolean;
  onUpdate: (orderId: string, updatedData: { Details: string; Status: string; Adresse: { Strasse: string; PLZ: string; Stadt: string; Land: string } }) => void;
  onClose: () => void;
}

const StatusDropdown = ({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => (
  <select className="form-select" value={value} onChange={onChange}>
    <option value="Abgeschlossen">Abgeschlossen</option>
    <option value="In Bearbeitung">In Bearbeitung</option>
  </select>
);

const EditOrderForm: React.FC<EditOrderFormProps> = ({ editedOrder, isOpen, onUpdate, onClose }) => {
  const [editedDetails, setEditedDetails] = useState(editedOrder.details);
  const [editedStatus, setEditedStatus] = useState(editedOrder.status);
  const [editedAddress, setEditedAddress] = useState({
    Strasse: '',
    PLZ: '',
    Stadt: '',
    Land: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Auftrag/${editedOrder.id}`);
        const { Adresse } = response.data;
        setEditedAddress({
          Strasse: Adresse.Strasse,
          PLZ: Adresse.PLZ,
          Stadt: Adresse.Stadt,
          Land: Adresse.Land,
        });
      } catch (error) {
        console.error('Fehler beim Abrufen des Auftrags:', error);
      }
    };

    fetchOrder();
  }, [editedOrder.id]);

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDetails(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedStatus(e.target.value);
  };

  const handleUpdate = () => {
    onUpdate(editedOrder.id, { Details: editedDetails, Status: editedStatus, Adresse: editedAddress });
    onClose();
  };

  return (
    <Modal
        show={isOpen}
        scrollable
      >
        <Modal.Header>
          <Modal.Title as="h5">Auftrag bearbeiten</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={handleUpdate} className="p-4 border rounded bg-light">

         <div className="col-md-6 mb-3">
           <label>Auftragsnummer:</label>
           <input type="text" value={editedOrder.id} readOnly className="form-control" />         </div>
         <div className="col-md-6 mb-3">
           <label>Kundennummer:</label>
           <input type="text" value={editedOrder.kunde} readOnly className="form-control" />
         </div>
         <div className="col-md-6 mb-3">
           <label>Status:</label>
           <StatusDropdown value={editedStatus} onChange={handleStatusChange} />
         </div>
         <div className="col-md-6 mb-3">
           <label>Datum:</label>
           <input type="text" value={editedOrder.datum} readOnly className="form-control" />
         </div>
         <div className="col-md-6 mb-3">
           <label>Vertrag:</label>
           <input type="text" value={editedOrder.vertrag} readOnly className="form-control" />
         </div>
         <div className="col-md-6 mb-3">
           <label>Verantwortlicher:</label>
           <input type="text" value={editedOrder.verantwortlicher} readOnly className="form-control" />
         </div>
         <div className="mb-3">
           <label>Details:</label>
           <input type="text" id="editedDetails" value={editedDetails} className="form-control" onChange={handleDetailsChange} />
         </div>

         <div className="row">
         <div className=" col-md-4 mb-3">
           <label>Straße:</label>
           <input type="text" value={editedAddress.Strasse} className="form-control" onChange={(e) => setEditedAddress({ ...editedAddress, Strasse: e.target.value })} />
         </div>
         <div className="col-md-4 mb-3">
           <label>PLZ:</label>
           <input type="text" value={editedAddress.PLZ} className="form-control" onChange={(e) => setEditedAddress({ ...editedAddress, PLZ: e.target.value })} />
         </div>
         <div className="col-md-4 mb-3">
           <label>Stadt:</label>
           <input type="text" value={editedAddress.Stadt} className="form-control" onChange={(e) => setEditedAddress({ ...editedAddress, Stadt: e.target.value })} />
         </div>
         </div>
         <div className="col-md-6 mb-3">
           <label>Land:</label>
           <input type="text" value={editedAddress.Land} className="form-control" onChange={(e) => setEditedAddress({ ...editedAddress, Land: e.target.value })} />
         </div>
         
       </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onClose}>
            Abbrechen
          </Button>
          <Button variant="primary" onClick={handleUpdate}>Speichern</Button>
        </Modal.Footer>
      </Modal>
  );
};

export default EditOrderForm;
