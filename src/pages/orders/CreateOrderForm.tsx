import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";

interface CreateOrderFormProps {
  isOpen: boolean;
  onCreate: (newOrderData: any) => void;
  onClose: () => void;
}

const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ isOpen, onCreate, onClose }) => {
  const [details, setDetails] = useState("");
  const [kundenID, setKundenID] = useState("");
  const [userID, setUserID] = useState("");
  const [datum, setDatum] = useState("");
  const [vertragID, setVertragID] = useState("");
  const [strasse, setStrasse] = useState("");
  const [stadt, setStadt] = useState("");
  const [plz, setPLZ] = useState("");
  const [land, setLand] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  

  const loggedInUser = useSelector((state: RootState) => state.Auth.user);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

     // Umwandeln des Datums in ISO-8601-Format
     const isoFormattedDate = selectedDate.toISOString();

     const status = "In Bearbeitung";

    const USER = loggedInUser.user.id;

    const newOrderData = {
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

    onCreate(newOrderData);

    // Setze die Felder zurück oder schließe das Formular nach Bedarf
    setDetails("");
    setKundenID("");
    setUserID("");
    setDatum("");
    setVertragID("");
    setStrasse("");
    setStadt("");
    setPLZ("");
    setLand("");
    // Weitere Felder zurücksetzen

    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-8">
          <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
          <div className="col-md-6 mb-3">
              <label htmlFor="kundenID" className="form-label">
                Kundennummer:
              </label>
              <input
                type="text"
                id="kundenID"
                className="form-control"
                value={kundenID}
                onChange={(e) => setKundenID(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="vertragID" className="form-label">
                Vertragnummer:
              </label>
              <input
                type="text"
                id="vertragID"
                className="form-control"
                value={vertragID}
                onChange={(e) => setVertragID(e.target.value)}
              />
            </div>

            <div className="row">
            <div className="col-md-4 mb-3">
                <label htmlFor="datum" className="form-label">
                Datum:
                </label>
                <DatePicker
                id="datum"
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <div className="d-grid gap-2 d-md-flex justify-content-md-between">
              <button type="submit" className="btn btn-primary me-md-2">
                Auftrag erstellen
              </button>
              <button onClick={onClose} className="btn btn-secondary">
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
};

export default CreateOrderForm;
