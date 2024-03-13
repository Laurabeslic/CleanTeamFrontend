import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import {Button, Modal } from "react-bootstrap";

interface EditSchluesselFormProps {
  editedSchluessel: {
    Schlüsselcode: string;
    Schlüsseltyp: string;
    Zustand: string;
    Verantwortlicher: string;
    Auftrag: string;
    Übergabedatum: string;
  };
  isOpen: boolean;
  onUpdate: (orderId: string, Schlüssel: any) => void;
  onClose: () => void;
}


const EditOrderForm: React.FC<EditSchluesselFormProps> = ({ editedSchluessel, isOpen, onUpdate, onClose }) => {
  const [editedSchluesseltyp, setEditedSchluesseltyp] = useState("");
  const [editedMitarbeiter, setEditedMitarbeiter] = useState("");
  const [editedZustand, setEditedZustand] = useState("");
  const [editedSchluesselArray, setEditedSchluesselArray] = useState<any[]>([]);

  useEffect(() => {
    setEditedMitarbeiter(editedSchluessel?.Verantwortlicher);
    setEditedSchluesseltyp(editedSchluessel?.Schlüsseltyp);
    setEditedZustand(editedSchluessel?.Zustand);
    fetchSchluesselArray();
  }, [editedSchluessel?.Schlüsselcode]);


  const handleUpdate = () => {
    const updatedSchluesselArray = editedSchluesselArray.map((schluessel: any) => {
        if (schluessel.Schlüsselcode === editedSchluessel.Schlüsselcode) {
          return {
            ...schluessel,
            Schlüsseltyp: editedSchluesseltyp,
            Zustand: editedZustand,
            VerantwortlicherMitarbeiter: editedMitarbeiter,
          };
        }
        return schluessel;
      });
      onUpdate(editedSchluessel?.Auftrag, updatedSchluesselArray);
    onClose();
  };
  const fetchSchluesselArray = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/auftrag/${editedSchluessel?.Auftrag}`);
      setEditedSchluesselArray(response?.data.Schlüssel);
    } catch (error) {
      console.error("Fehler beim Abrufen des Schlüsselarrays:", error);
    }
  };
  return (
    <Modal
        show={isOpen}
        scrollable
        centered
      >
        <Modal.Header>
          <Modal.Title as="h5">Schlüsel bearbeiten</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={handleUpdate} className="p-4 border rounded bg-light">

        <div className="row">
         <div className="col-md-6 mb-3">
           <label>Schlüsselcode:</label>
           <input type="text" value={editedSchluessel?.Schlüsselcode} readOnly className="form-control" />
        </div>
         <div className="col-md-6 mb-3">
           <label>Schlüsseltyp:</label>
           <input type="text" value={editedSchluesseltyp} className="form-control" onChange={(e) => setEditedSchluesseltyp(e.target.value)}/>
         </div>
         </div>

         <div className="row">
         <div className="col-md-6 mb-3">
           <label>Übergabedatum:</label>
           <input type="text" value={editedSchluessel?.Übergabedatum} readOnly className="form-control" />
         </div>
         <div className="col-md-6 mb-3">
           <label>Zustand:</label>
           <input type="text" value={editedZustand} className="form-control" onChange={(e) => setEditedZustand(e.target.value)}/>
         </div>
         </div>

         <div className="row">
         <div className="col-md-6 mb-3">
           <label>Verantwortlicher:</label>
           <input type="text" value={editedMitarbeiter}  className="form-control" onChange={(e) => setEditedMitarbeiter(e.target.value)}/>
         </div>
         <div className="col-md-6 mb-3">
           <label>Auftragnummer:</label>
           <input type="text" value={editedSchluessel?.Auftrag} readOnly  className="form-control" />
         </div>

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
