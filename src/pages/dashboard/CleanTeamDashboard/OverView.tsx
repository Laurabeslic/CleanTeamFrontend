import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Dropdown } from "react-bootstrap";
import axios from "axios";
import CreateKundeForm from "../../customers/CreateKundeForm";
import CreateAuftragForm from "../../Auftraege/CreateAuftragForm"
import OverViewItem from "../../../components/OverViewItem";


const OverView = () => {
  const [totalKunden, setTotalKunden] = useState(0);
  const [totalAuftraege, setTotalAuftraege] = useState(0);
  const [inProgressAuftraege, setInProgressAuftraege] = useState(0);
  const [completedAuftraege, setCompletedAuftraege] = useState(0);
  const [totalVertraege, setTotalVertraege] = useState(0);
  const [showCreateKundeForm, setShowCreateKundeForm] = useState(false);
  const [showCreateAuftragForm, setShowCreateAuftragForm] = useState(false);

  useEffect(() => {

    fetchKunden();
    fetchAuftraege();
    fetchVertraege();
}, []);


  const fetchKunden = async () => {
    try {
        const response = await axios.get("http://localhost:3001/kunde/");
        const formattedData = response.data.map((kunde: any) => ({
            KundenID: kunde.KundenID,
            Name: kunde.Name,
            Adresse: kunde.Adresse,
            Telefon: kunde.Telefon,
            Email: kunde.Email,
            Vertraege: kunde.Vertraege
        }));
        setTotalKunden(formattedData.length);

    } catch (error) {
        console.error("Es gab einen Fehler beim Abrufen der Kunden:", error);
    }
  };

  const fetchAuftraege = async () => {
    try {
        const response = await axios.get("http://localhost:3001/auftrag/");
        const formattedData = response.data.map((auftrag: any) => ({
            id: auftrag.AuftragsID,
            details: auftrag.Details,
            kunde: auftrag.KundenID,
            status: auftrag.Status,
            datum: new Date(auftrag.Datum).toLocaleDateString(),
            vertrag: auftrag.VertragID,
            verantwortlicher: auftrag.UserID
        }));

        setTotalAuftraege(formattedData.length);
        setInProgressAuftraege(formattedData.filter((auftrag: { status: string; }) => auftrag.status === "In Bearbeitung").length);
        setCompletedAuftraege(formattedData.filter((auftrag: { status: string; }) => auftrag.status === "Abgeschlossen").length);
    } catch (error) {
        console.error("Es gab einen Fehler beim Abrufen der Aufträge:", error);
    }
  };

  const fetchVertraege = async () => {
    try {
        const response = await axios.get("http://localhost:3001/vertrag");
        const anzahlVertraege = response.data.length;
        setTotalVertraege(anzahlVertraege);
    } catch (error) {
        console.error("Es gab einen Fehler beim Abrufen der Verträge:", error);
    }
  };

  const handleCreateKunde = async (newKundeData: any) => {
    try {
        const response = await axios.post("http://localhost:3001/Kunde/", newKundeData);
        setShowCreateKundeForm(false);
        await fetchKunden();
      } catch (error) {
        console.error("Fehler beim Erstellen des Kunden:", error);
      }
  };
  const handleNeuerKundeForm = () => {
    setShowCreateKundeForm(true);
  };

  const closeCreateKundeForm = () => {
    setShowCreateKundeForm(false);
  };

  const handleCreateAuftrag = async (newAuftragData: any) => {
    try {
      const response = await axios.post("http://localhost:3001/Auftrag/", newAuftragData);
      setShowCreateAuftragForm(false);
      await fetchAuftraege();
    } catch (error) {
      console.error("Fehler beim Erstellen des Auftrags:", error);
    }
  };
  const handleNeuerAuftragForm = () => {
    setShowCreateAuftragForm(true);
  };

  const closeCreateAuftragForm = () => {
    setShowCreateAuftragForm(false);
  };

  return (
    <Card>
      <Card.Body className="p-0">
        <div className="p-3">
          <Dropdown className="float-end" align="end">
            <Dropdown.Toggle
              as="a"
              className="arrow-none text-muted cursor-pointer"
            >
              <i className="uil uil-ellipsis-v"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleNeuerKundeForm}>
                <i className="uil uil-user-plus me-2"></i>Neuer Kunde
              </Dropdown.Item>
              <Dropdown.Item onClick={handleNeuerAuftragForm}>
                <i className="uil-file-edit-alt me-2"></i>Neuer Auftrag
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-danger">
                <i className="uil uil-exit me-2"></i>Exit
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <h5 className="card-title header-title mb-0">Übersicht</h5>
        </div>

        <OverViewItem
          stats={totalKunden.toString()}
          title={"Kunden"}
          icon={"users"}
          iconClass={"icon-md"}
        />
        <OverViewItem
          stats={totalAuftraege.toString()}
          title={"Aufträge"}
          icon="clipboard"
          iconClass="icon-md"
        />
        <OverViewItem
          stats={totalVertraege.toString()}
          title={"Verträge"}
          icon="file-text"
          iconClass={"icon-md"}
        />

        <Link to="/orders" className="p-2 d-block text-end">
          Alle Aufträge <i className="uil-arrow-right"></i>
        </Link>
      </Card.Body>

      {showCreateKundeForm && (
        <CreateKundeForm
          isOpen={showCreateKundeForm}
          onCreate={handleCreateKunde}
          onClose={closeCreateKundeForm}
        />
      )}

      {showCreateAuftragForm && (
        <CreateAuftragForm
          isOpen={showCreateAuftragForm}
          onCreate={handleCreateAuftrag}
          onClose={closeCreateAuftragForm}
        />
      )}
    </Card>
    
  );
};

export default OverView;
