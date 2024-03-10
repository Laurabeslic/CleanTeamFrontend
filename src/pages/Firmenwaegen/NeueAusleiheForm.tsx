import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";

interface AusleihhistorieEntry {
  Ausleiher: string;
  Ausleihdatum: string;
  Rückgabedatum: string | null;
}

interface CreateAnleiheFormProps {
    editedWagen: {
        id: string,
        kennzeichen: string,
        modell: string,
        baujahr: number,
        letzteWartung: string,
        farbe: string,
        kraftstoffart: string,
        marke: string,
        kilometerstand: number,
        tankvolumen: number,
        ausleihhistorie: AusleihhistorieEntry[]
      };
  isOpen: boolean;
  onUpdate: (FirmenwagenID: string, Ausleihhistorie: AusleihhistorieEntry[]) => void;
  onClose: () => void;
}

const CreateAnleiheForm: React.FC<CreateAnleiheFormProps> = ({
    editedWagen,
  isOpen,
  onUpdate,
  onClose,
}) => {
  const [ausleiher, setAusleiher] = useState('');
  const [ausleihdatum, setAusleihdatum] = useState<Date | null>(new Date());
  const [showEmployeeErrorMessage, setShowEmployeeErrorMessage] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});

   //Mitarbeiternummer prüfen
   const checkEmployeeExistence = async (ausleiher:string) => {
    try {
      const response = await axios.get(`http://localhost:3001/mitarbeiter/${ausleiher}`);
      return response.data; 
    } catch (error) {
      return null; // Mitarbeiternummer existiert nicht
    }
  };

  const handleCreateAnleihe = async () => {

    const requiredFields = ['ausleiher', "ausleihdatum"];
    const errors: { [key: string]: boolean } = {};

    requiredFields.forEach(field => {
      errors[field] = !eval(field);
    });

    setFieldErrors(errors);

    const employeeExists = await checkEmployeeExistence(ausleiher);
    if (!employeeExists ) {

        setShowEmployeeErrorMessage(true);
        return; 
      }



    if (ausleiher && ausleihdatum) {
      const newEntry: AusleihhistorieEntry = {
        Ausleiher: ausleiher,
        Ausleihdatum: ausleihdatum.toISOString(),
        Rückgabedatum: null,
      };

      const response = await axios.get(`http://localhost:3001/firmenwagen/${editedWagen?.id}`);
      const currentAusleihehistorie: AusleihhistorieEntry[] = response.data.Ausleihhistorie;
  
      // Hinzufügen der neuen Ausleihe zum aktuellen Ausleihehistorie
      const updatedAusleihehistorie = [...currentAusleihehistorie, newEntry];

      console.log(updatedAusleihehistorie);

      onUpdate(editedWagen?.id, updatedAusleihehistorie);
      setShowEmployeeErrorMessage(false);
      onClose();
    }
  };

  const handleDatumChange = (date: Date | [Date | null, Date | null] | null) => {
    if (date instanceof Date) {
      // Wenn das ausgewählte Datum ein Date-Objekt ist
      setAusleihdatum(date);
    } else if (Array.isArray(date) && date[0] instanceof Date) {
      // Wenn das ausgewählte Datum ein Array von Date-Objekten ist
      setAusleihdatum(date[0]);
    } else {
      // Andernfalls ist das ausgewählte Datum null
      setAusleihdatum(null);
    }
  };
  const closeForm = async(e: React.FormEvent) => {
    setAusleihdatum(new Date());
    setAusleiher('');
    setShowEmployeeErrorMessage(false);
    onClose();
  };


  return (
    <Modal show={isOpen} onHide={onClose} scrollable centered>
      <Modal.Header closeButton>
        <Modal.Title>Neue Ausleihe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Ausleiher</label>
              <input
                type="text"
                className={`form-control ${fieldErrors['ausleiher'] ? 'is-invalid' : ''} ${showEmployeeErrorMessage ? 'is-invalid' : ''}`}
                value={ausleiher}
                placeholder='Mitarbeiternummer'
                onChange={(e) => setAusleiher(e.target.value)}
              />
                {fieldErrors['ausleiher'] && (
              <div className="invalid-feedback">{fieldErrors['ausleiher']}</div>
              )}
               {/* Fehlermeldung anzeigen, wenn showErrorMessage true ist */}
                {showEmployeeErrorMessage && (
                  <div className="text-danger">
                    <p>Die Mitarbeiternummer existiert nicht!</p>
                  </div>
                )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Ausleihdatum</label>
              <br />
              <DatePicker
                selected={ausleihdatum}
                onChange={handleDatumChange}
                dateFormat="dd.MM.yyyy"
                className={`form-control ${fieldErrors['ausleihdatum'] ? 'is-invalid' : ''} `}
              />
               {fieldErrors['ausleihdatum'] && (
              <div className="invalid-feedback">{fieldErrors['ausleihdatum']}</div>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeForm}>
          Abbrechen
        </Button>
        <Button variant="primary" onClick={handleCreateAnleihe}>
          Ausleihe hinzufügen
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateAnleiheForm;
