import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector} from "react-redux";
import { RootState} from "../../redux/store";
import axios from 'axios';
import {Button, Modal } from "react-bootstrap";

interface CreateAuftragFormProps {
  isOpen: boolean;
  onCreate: (newAuftragData: any) => void;
  onClose: () => void;
}

const CreateForm: React.FC<CreateAuftragFormProps> = ({ isOpen, onCreate, onClose }) => {
  const [details, setDetails] = useState("");
  const [kundenID, setKundenID] = useState("");
  const [vertragID, setVertragID] = useState("");
  const [strasse, setStrasse] = useState("");
  const [stadt, setStadt] = useState("");
  const [plz, setPLZ] = useState("");
  const [land, setLand] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCustomerErrorMessage, setShowCustomerErrorMessage] = useState(false);
  const [showContractErrorMessage, setShowContractErrorMessage] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});

  const loggedInUser = useSelector((state: RootState) => state.Auth.user);

  //Kundennummer prüfen
  const checkCustomerExistence = async (kundenID:string) => {
    try {
      const response = await axios.get(`http://localhost:3001/Kunde/${kundenID}`);
      return response.data; 
    } catch (error) {
      return null; // Kundennummer existiert nicht
    }
  };

  // Vertrag prüfen
  const checkcontractExistence = async (vertrag:string) => {
    try {
      const response = await axios.get(`http://localhost:3001/Vertrag/${vertrag}`);
      return response.data; 
    } catch (error) {
      return null; // Vertrag existiert nicht
    }
  };

  //Richtiger Vertrag?
  const checkContractForCustomer = async (kundenID: string, vertragID: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/vertrag/${vertragID}`);
      const contract = response.data;
  
      // Überprüfen, ob der Vertrag zu der angegebenen Kundennummer gehört
      if (contract.KundenID === kundenID) {
        return true; // Der Vertrag gehört zum Kunden
      } else {
        return false; // Der Vertrag gehört nicht zum Kunden
      }
    } catch (error) {
      console.error("Error checking contract for customer:", error);
      return false; // Es gab einen Fehler beim Überprüfen des Vertrags
    }
  };
  
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['kundenID', 'vertragID', 'selectedDate', 'strasse', 'plz', 'stadt', 'land', 'details'];
    const errors: { [key: string]: boolean } = {};

    requiredFields.forEach(field => {
      errors[field] = !eval(field);
    });

    setFieldErrors(errors);

    // Überprüfen, ob die PLZ eine Zahl ist
    const isPLZValid = /^\d+$/.test(plz);
    
    if (!isPLZValid) {
      // Zeige eine Fehlermeldung an, wenn die PLZ keine Zahl ist
      setFieldErrors({ ...fieldErrors, plz: true });
      return;
    }

    if (Object.values(errors).some(error => error)) {
      return;
    }

    const customerExists = await checkCustomerExistence(kundenID);
    const contractExists = await checkcontractExistence(vertragID);
    // Überprüfen, ob der Vertrag zu der angegebenen Kundennummer gehört
    const isContractForCustomer = await checkContractForCustomer(kundenID, vertragID);
    
    if (!customerExists || !contractExists || !isContractForCustomer) {

      if(!customerExists){
        setShowCustomerErrorMessage(true);
      }
      if(!contractExists || ! isContractForCustomer){
        setShowContractErrorMessage(true);
      }
      return; 
    }

     // Umwandeln des Datums in ISO-8601-Format
     const isoFormattedDate = selectedDate.toISOString();

     const status = "In Bearbeitung";

    const USER = loggedInUser.user.id;


    const newAuftragData = {
        Details: details,
        KundenID: kundenID,
        UserID: USER,
        Datum: isoFormattedDate, // Verwenden Sie das umformatierte Datum,
        VertragID: vertragID,
        Status: status,
        Adresse: {
          Strasse: strasse,
          Stadt: stadt,
          PLZ: plz,
          Land: land,
        },
      };

    onCreate(newAuftragData);

    // Setze die Felder zurück oder schließe das Formular nach Bedarf
    setDetails("");
    setKundenID("");
    setVertragID("");
    setStrasse("");
    setStadt("");
    setPLZ("");
    setLand("");
    setShowContractErrorMessage(false);
    setShowCustomerErrorMessage(false);


    onClose();
  };

  const closeForm = async(e: React.FormEvent) => {
   

    // Setze die Felder zurück oder schließe das Formular nach Bedarf
    setDetails("");
    setKundenID("");
    setVertragID("");
    setStrasse("");
    setStadt("");
    setPLZ("");
    setLand("");
    // Weitere Felder zurücksetzen

    
    setShowCustomerErrorMessage(false);
    setShowContractErrorMessage(false);
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
          <Modal.Title as="h5">Neuer Auftrag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="p-4 border rounded bg-light">
           <div className="col-md-6 mb-3">
               <label htmlFor="kundenID" className="form-label">
                 Kundennummer:
               </label>
               <input
                type="text"
                id="kundenID"
                className={`form-control ${fieldErrors['kundenID'] ? 'is-invalid' : ''} ${showCustomerErrorMessage ? 'is-invalid' : ''}`}
                value={kundenID}
                onChange={(e) => setKundenID(e.target.value)}
              />
               {fieldErrors['kundenID'] && (
              <div className="invalid-feedback">{fieldErrors['kundenID']}</div>
              )}
               {/* Fehlermeldung anzeigen, wenn showErrorMessage true ist */}
                {showCustomerErrorMessage && (
                  <div className="text-danger">
                    <p>Die Kundennummer existiert nicht!</p>
                  </div>
                )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="vertragID" className="form-label">
                Vertragnummer:
              </label>
              <input
                type="text"
                id="vertragID"
                className={`form-control ${fieldErrors['vertragID'] ? 'is-invalid' : ''} ${showContractErrorMessage ? 'is-invalid' : ''}`}
                value={vertragID}
                onChange={(e) => setVertragID(e.target.value)}
              />
              {/* Fehlermeldung anzeigen, wenn showErrorMessage true ist */}
              {showContractErrorMessage && (
                  <div className="text-danger">
                    <p>Der Vertrag existiert nicht!</p>
                  </div>
                )}
            </div>

            <div className="row">
            <div className="col-md-4 mb-3">
                <label htmlFor="datum" className="form-label">
                Datum:
                </label>
                <DatePicker
                id="datum"
                className={`form-control ${fieldErrors['selectedDate'] ? 'is-invalid' : ''}`}
                selected={selectedDate}
                onChange={(date: Date) => setSelectedDate(date)}
                />
                </div>
            </div>

            <div className="row">
            <div className="col-md-4 mb-3">
                <label htmlFor="strasse" className="form-label">
                Straße:
                </label>
                <input
                type="text"
                id="strasse"
                className={`form-control ${fieldErrors['strasse'] ? 'is-invalid' : ''}`}
                value={strasse}
                onChange={(e) => setStrasse(e.target.value)}
                />
            </div>
            <div className="col-md-4 mb-3">
                <label htmlFor="plz" className="form-label">
                PLZ:
                </label>
                <input
                type="text"
                id="plz"
                className={`form-control ${fieldErrors['plz'] ? 'is-invalid' : ''}`}
                value={plz}
                onChange={(e) => setPLZ(e.target.value)}
                />
            </div>
            <div className="col-md-4 mb-3">
                <label htmlFor="stadt" className="form-label">
                Stadt:
                </label>
                <input
                type="text"
                id="stadt"
                className={`form-control ${fieldErrors['stadt'] ? 'is-invalid' : ''}`}
                value={stadt}
                onChange={(e) => setStadt(e.target.value)}
                />
            </div>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="land" className="form-label">
                Land:
              </label>
              <input
                type="text"
                id="land"
                className={`form-control ${fieldErrors['land'] ? 'is-invalid' : ''}`}
                value={land}
                onChange={(e) => setLand(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="details" className="form-label">
                Details:
              </label>
              <input
                type="text"
                id="details"
                className={`form-control ${fieldErrors['details'] ? 'is-invalid' : ''}`}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
          </form>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={closeForm}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} variant="primary"> Auftrag erstellen</Button>
        </Modal.Footer>
      </Modal>
  );
  
};

export default CreateForm;
