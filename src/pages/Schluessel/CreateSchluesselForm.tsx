import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector} from "react-redux";
import { RootState} from "../../redux/store";
import axios from 'axios';
import {Button, Modal } from "react-bootstrap";

interface CreateSchluesselFormProps {
  isOpen: boolean;
  onCreate: (newSchluesselData: any) => void;
  onClose: () => void;
}

const CreateForm: React.FC<CreateSchluesselFormProps> = ({ isOpen, onCreate, onClose }) => {
  const [schluesselcode, setSchluesselcode] = useState("");
  const [schluesseltyp, setSchlüsseltyp] = useState("");
  const [zustand, setZustand] = useState("");
  const [auftrag, setAuftrag] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCodeErrorMessage, setShowCodeErrorMessage] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});

  const loggedInUser = useSelector((state: RootState) => state.Auth.user);

  const checkKeyExistence = async (schlüsselcode:string) => {
    try {
      const response = await axios.get("http://localhost:3001/auftrag/schluessel");
      let formattedData = response.data.map((key: any) => ({
          Schlüsselcode: key.Schlüsselcode,
      }));
      return formattedData.some((key: any) => key.Schlüsselcode === schlüsselcode);
  } catch (error) {
      console.error("Es gab einen Fehler beim Abrufen der Schlüssel:", error);
  }   return false;
    };

  
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['schluesselcode', 'schluesseltyp', 'selectedDate', 'zustand', 'auftrag'];
    const errors: { [key: string]: boolean } = {};

    requiredFields.forEach(field => {
      errors[field] = !eval(field);
    });

    setFieldErrors(errors);

    if (Object.values(errors).some(error => error)) {
      return;
    }

     const keyExists = await checkKeyExistence(schluesselcode);
    
    if (keyExists) {
        setShowCodeErrorMessage(true);
         return; 
    }

     // Umwandeln des Datums in ISO-8601-Format
     const isoFormattedDate = selectedDate.toISOString();
    console.log(isoFormattedDate);

    const USER = loggedInUser.user.id;


    const newSchluesselData = {
        Schlüsselcode: schluesselcode,
        Schlüsseltyp: schluesseltyp,
        Zustand: zustand,
        VerantwortlicherMitarbeiter: USER,
        Übergabedatum: isoFormattedDate, 
        AuftragsID: auftrag
      };

    onCreate(newSchluesselData);

    setSchluesselcode("");
    setSchlüsseltyp("");
    setZustand("");
    setAuftrag("");
    setShowCodeErrorMessage(false);
    onClose();
  };

  const closeForm = async(e: React.FormEvent) => {
  
    setSchluesselcode("");
    setSchlüsseltyp("");
    setZustand("");
    setAuftrag("");

    setShowCodeErrorMessage(false);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
        show={isOpen}
        scrollable
      >
        <Modal.Header >
          <Modal.Title as="h5">Neuer Schlüssel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="p-4 border rounded bg-light">
           <div className="col-md-8 mb-3">
               <label htmlFor="schluesselcode" className="form-label">
                 Schlüsselcode:
               </label>
               <input
                type="text"
                id="schluesselcode"
                className={`form-control ${fieldErrors['schluesselcode'] ? 'is-invalid' : ''} ${showCodeErrorMessage ? 'is-invalid' : ''}`}
                value={schluesselcode}
                onChange={(e) => setSchluesselcode(e.target.value)}
              />
               {showCodeErrorMessage && (
                  <div className="text-danger">
                    <p>Dieser Schlüssel existiert bereits!</p>
                  </div>
                )}
            </div>
           

            <div className="col-md-6 mb-3">
              <label htmlFor="schluesseltyp" className="form-label">
                Schlüsseltyp:
              </label>
              <input
                type="text"
                id="schluesseltyp"
                className={`form-control ${fieldErrors['schluesseltyp'] ? 'is-invalid' : ''} `}
                value={schluesseltyp}
                onChange={(e) => setSchlüsseltyp(e.target.value)}
              />
             
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="zustand" className="form-label">
                Zustand:
              </label>
              <input
                type="text"
                id="zustand"
                className={`form-control ${fieldErrors['zustand'] ? 'is-invalid' : ''}`}
                value={zustand}
                onChange={(e) => setZustand(e.target.value)}
              />
            </div>

            <div className="row">
            <div className="col-md-4 mb-3">
                <label htmlFor="datum" className="form-label">
                Übergabedatum:
                </label>
                <DatePicker
                id="datum"
                dateFormat="dd.MM.yyyy"
                className={`form-control ${fieldErrors['selectedDate'] ? 'is-invalid' : ''}`}
                selected={selectedDate}
                onChange={(date: Date) => setSelectedDate(date)}
                />
                </div>
            </div>

            <div className="col-md-4">
                <label htmlFor="auftragnummer" className="form-label">
                Auftragnummer:
                </label>
                <input
                type="text"
                id="auftragnummer"
                className={`form-control ${fieldErrors['auftrag'] ? 'is-invalid' : ''} `}
                value={auftrag}
                onChange={(e) => setAuftrag(e.target.value)}
                />
            </div>
           
        
          </form>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={closeForm}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} variant="primary"> Schlüssel erstellen</Button>
        </Modal.Footer>
      </Modal>
  );
  
};

export default CreateForm;
