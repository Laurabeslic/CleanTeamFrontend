import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";

interface AusleihhistorieEntry {
    Ausleiher: string;
    Ausleihdatum: string;
    Rückgabedatum: string | null;
  }

interface EditWagenFormProps {
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
  onUpdate: (FirmenwagenID: string, updatedWagen: {
    LetzteWartung: string,
    Kilometerstand: number,
    Ausleihhistorie: AusleihhistorieEntry[]
  }) => void;
  onClose: () => void;
}

const EditWagenForm: React.FC<EditWagenFormProps> = ({ editedWagen, isOpen, onUpdate, onClose }) => {
    const [editedKilometerstand, setEditedKilometerstand] = useState(""); // Initialisierung mit 0

  const [editedLetzteWartung, setEditedLetzteWartung] = useState(new Date());
  const [ausleiher, setAusleiher] = useState<string | null>(null); // Zustand für den aktuellen Ausleiher
  const [rueckgabedatum, setRueckgabedatum] = useState<Date | null>(null); // Zustand für das Rückgabedatum
  
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchWagen = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Firmenwagen/${editedWagen?.id}`);

        setEditedKilometerstand(response.data.Kilometerstand);
        
        setEditedLetzteWartung(new Date(response.data.LetzteWartung));

        const currentAusleiher = editedWagen.ausleihhistorie.find(entry => entry.Rückgabedatum === null);
        if (currentAusleiher) {
          setAusleiher(currentAusleiher.Ausleiher); // Setze den aktuellen Ausleiher
          console.log(ausleiher);
        } else {
          setAusleiher(null); // Setze den Ausleiher auf null, wenn das Auto verfügbar ist
        }
       
      } catch (error) {
        console.error('Fehler beim Abrufen des Wagen:', error);
      }
    };

    fetchWagen();
  }, [editedWagen?.id]);


  // const handleKilometerstandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setEditedKilometerstand(parseInt(e.target.value));
  //   console.log(editedKilometerstand);
  // };


  const handleUpdate = () => {

    const requiredFields = ['editedKilometerstand', 'editedLetzteWartung'];
    const errors: { [key: string]: boolean } = {};

    requiredFields.forEach(field => {
      errors[field] = !eval(field);
    });

     // Überprüfen, ob eine Zahl ist
     const isValid = /^\d+$/.test(editedKilometerstand);
    
     if (!isValid) {
       // Zeige eine Fehlermeldung an, wenn keine Zahl ist
       setFieldErrors({ ...fieldErrors, editedKilometerstand: true });
       return;
     }
    setFieldErrors(errors);



    try {
      // Objekt mit den aktualisierten Informationen
      console.log(rueckgabedatum);
      const updatedWagen = {
        LetzteWartung: editedLetzteWartung.toISOString(),
        Kilometerstand: parseInt(editedKilometerstand),
        Ausleihhistorie: editedWagen.ausleihhistorie.map(entry => ({
            ...entry,
            Rückgabedatum: entry.Ausleiher === ausleiher ? (rueckgabedatum ? rueckgabedatum.toISOString() : null) : entry.Rückgabedatum
          }))
      };
      console.log(updatedWagen);
      // Übergeben Sie das aktualisierte Wagen-Objekt an die onUpdate Methode
      onUpdate(editedWagen.id, updatedWagen);
      onClose();
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Wagens:', error);
    }
  };
  

  const closeForm = async(e: React.FormEvent) => {
    setFieldErrors({});
    onClose();
  };
  


  return (
    <Modal
      show={isOpen}
      scrollable
    >
      <Modal.Header>
        <Modal.Title as="h5">Firmenwagen bearbeiten</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleUpdate} className="p-4 border rounded bg-light">
       <div className='row'>
       <div className="col-md-6 mb-3">
            <label>Wagennummer:</label>
            <input type="text" value={editedWagen?.id} readOnly className="form-control" />
          </div>

          <div className="col-md-6 mb-3">
            <label>Kennzeichen:</label>
            <input type="text" value={editedWagen?.kennzeichen} className='form-control' readOnly />
          </div>
       </div>
         
         <div className='row'>
         <div className="col-md-6 mb-3">
            <label>Marke:</label>
            <input type="text" value={editedWagen?.marke} className='form-control' readOnly />
          </div>
          <div className="col-md-6 mb-3">
            <label>Modell:</label>
            <input type="text" value={editedWagen?.modell} className='form-control' readOnly />
          </div>

         </div>

         <div className='row'>
          <div className=" col-md-6 mb-3">
            <label>Baujahr:</label>
            <input type="text" value={editedWagen?.baujahr} className='form-control' readOnly />
          </div>

          
            <div className="col-md-6 mb-3">
              <label>Farbe:</label>
              <input type="text" value={editedWagen?.farbe} className='form-control' readOnly />
            </div>
        </div>

        <div className='row'>
             <div className="col-md-6 mb-3">
              <label>Tankvolumen:</label>
              <input type="text" value={editedWagen?.tankvolumen} className='form-control' readOnly/>
            </div>

            <div className="col-md-6 mb-3">
              <label>Kraftstoffart:</label>
              <input type="text" value={editedWagen?.kraftstoffart} className='form-control' readOnly/>
        </div>
        </div>

  
        <div className="col-md-6 mb-3">
              <label>Kilometerstand:</label>
              <input type="text" value={editedKilometerstand} className={`form-control ${fieldErrors['editedKilometerstand'] ? 'is-invalid' : ''}`} 
              onChange={(e) => setEditedKilometerstand(e.target.value)} />
            </div>

            <div className="col-md-6 mb-3">
                <label htmlFor="letzteWartung" className="form-label">
                Letzte Wartung:
                </label>
                <DatePicker
                id="datum"
                dateFormat="dd.MM.yyyy"
                className={`form-control ${fieldErrors['editedLetzteWartung'] ? 'is-invalid' : ''}`}
                selected={editedLetzteWartung}
                onChange={(date: Date) => setEditedLetzteWartung(date)}
                />
                </div>
         

        {ausleiher && (
              <div > 
              <div className="col-md-6 mb-3">
                    <label>Derzeit ausgeliehen von:</label>
                    <input type="text" value={ausleiher} className='form-control' readOnly/>
                  </div>
      
                  <div className="col-md-6 mb-3">
                      <label htmlFor="rueckgabedatum" className="form-label">
                       Rückgabe:
                      </label>
                      <DatePicker
                        id="rueckgabedatum"
                        className="form-control"
                        dateFormat="dd.MM.yyyy"
                        selected={rueckgabedatum}
                        onChange={(date: Date) => setRueckgabedatum(date)}
                        placeholderText="Wähle das Rückgabedatum"
                    />
                      </div>
               </div>
      
        )}
       
       
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={closeForm}>
          Abbrechen
        </Button>
        <Button variant="primary" onClick={handleUpdate}>Speichern</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditWagenForm;
