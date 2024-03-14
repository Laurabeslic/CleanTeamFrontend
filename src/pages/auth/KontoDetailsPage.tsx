import React, { useState, useEffect } from "react";
import { Card, Button, Form, FormGroup, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";

const PersonalDetails = () => {
  const loggedInUser = useSelector((state: RootState) => state.Auth.user);
  const [editMode, setEditMode] = useState(false);

  
  const [employeeData, setEmployeeData] = useState<any>(null);

  const [editedTelefon, setEditedTelefon] = useState("");
  const [editedStrasse, setEditedStrasse] = useState("");
  const [editedPLZ, setEditedPLZ] = useState("");
  const [editedStadt, setEditedStadt] = useState("");
  const [editedLand, setEditedLand] = useState("");
  const [editedFaehigkeiten, setEditedFaehigkeiten] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    
    fetchEmployeeData();
  }, [loggedInUser]);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/mitarbeiter");
      const filteredData = response.data.filter(
        (mitarbeiter: any) => mitarbeiter.UserID === loggedInUser.user.id
      );
      if (filteredData.length > 0) {
        const employee = filteredData[0];
        setEmployeeData({
          MitarbeiterID: employee.MitarbeiterID,
          Name: employee.Name,
          Adresse: employee.Adresse,
          Telefon: employee.Telefon,
          Position: employee.Position,
          Faehigkeiten: employee.Faehigkeiten,
          UserId: employee.UserID
        });
        setEditedTelefon(employee.Telefon);
        setEditedStrasse(employee.Adresse.Strasse);
        setEditedPLZ(employee.Adresse.PLZ);
        setEditedStadt(employee.Adresse.Stadt);
        setEditedLand(employee.Adresse.Land);
        setEditedFaehigkeiten([...employee.Faehigkeiten]);
      } else {
        setEmployeeData(null);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const handleTelefonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTelefon(e.target.value);
  };
  const handleStrasseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedStrasse(e.target.value);
  };

  const handlePLZChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPLZ(e.target.value);
  };

  const handleStadtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedStadt(e.target.value);
  };

  const handleLandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedLand(e.target.value);
  };
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Splitte die Eingabe anhand von Kommas und entferne Leerzeichen und füge sie als Array von Strings hinzu
    setEditedFaehigkeiten(e.target.value.split(",").map(skill => skill.trim()));
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async() => {
    const requiredFields = ['editedTelefon', 'editedStrasse', 'editedPLZ', 'editedStadt', 'editedLand'];
    const errors: { [key: string]: boolean } = {};

    requiredFields.forEach(field => {
      errors[field] = !eval(field);
    });
    // Überprüfen, ob die PLZ eine Zahl ist
    const isPLZValid = /^\d+$/.test(editedPLZ);
    
    if (!isPLZValid) {
      // Zeige eine Fehlermeldung an, wenn die PLZ keine Zahl ist
      setFieldErrors({ ...fieldErrors, editedPLZ: true });
      return;
    }

    setFieldErrors(errors);

    if (Object.values(errors).some(error => error)) {
      return;
    }

    try {
      const updatedData = {
        MitarbeiterID: employeeData.MitarbeiterID,
        Adresse: {
          Strasse: editedStrasse,
          PLZ: editedPLZ,
          Stadt: editedStadt,
          Land: editedLand
        },
        Telefon: editedTelefon,
        Faehigkeiten: editedFaehigkeiten
      };
      
      await axios.put(`http://localhost:3001/mitarbeiter/${employeeData.MitarbeiterID}`, updatedData);
  
      fetchEmployeeData();
  
      console.log("Mitarbeiterdaten erfolgreich aktualisiert!");
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Mitarbeiterdaten:", error);
    
    }
    
    setEditMode(false);
  };
  
  const handleCancelClick = () => {
    setEditedTelefon(employeeData?.Telefon);
    setEditedStrasse(employeeData?.Adresse.Strasse);
    setEditedPLZ(employeeData?.Adresse.PLZ);
    setEditedStadt(employeeData?.Adresse.Stadt);
    setEditedLand(employeeData?.Adresse.Land);
    setEditedFaehigkeiten([...employeeData?.Faehigkeiten]);
    setFieldErrors({});
    setEditMode(false);
  };
  return (
    <Card className="mt-4">
      <Card.Body>
        <div className="text-center mt-2">
          <img
            src={`https://ui-avatars.com/api/?name=${loggedInUser.user.firstName}+${loggedInUser.user.lastName}&background=random`}
            alt=""
            className="avatar-lg rounded-circle"
          />
          <h4 className="mt-2 mb-0">{loggedInUser.user.username}</h4>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3 mt-4 pt-2 border-top">
          <h4 className="mb-0 fs-15">Informationen</h4>
          {!editMode && employeeData &&(
            <Button variant="outline-primary" size="sm" onClick={handleEditClick}>
              <i className="bi bi-pencil-fill"></i>
            </Button>
          )}
        </div>
        {editMode ? (
          <Form>
            <Row>
              <Col md={2}>
             <Form.Group className="mb-3 col-md-10">
              <Form.Label>Benutzernummer</Form.Label>
              <Form.Control
                type="text"
                name="benutzernummer"
                value={loggedInUser.user.id}
                readOnly
              />
            </Form.Group>
            </Col>
            <Col md={2}>
            <Form.Group className="mb-3 col-md-10">
              <Form.Label>Benutzername</Form.Label>
              <Form.Control
                type="text"
                name="benutzername"
                value={loggedInUser.user.username}
                readOnly
              />
            </Form.Group>
            </Col>
            </Row>

            <Row>
              <Col md={2}>
            <Form.Group className="mb-3 col-md-10">
              <Form.Label>Vorname</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={loggedInUser.user.firstName}
                readOnly
              />
            </Form.Group>
            </Col>
            
            <Col md={2}>
            <Form.Group className="mb-3 col-md-10">
              <Form.Label>Nachname</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={loggedInUser.user.lastName}
                readOnly
              />
            </Form.Group>
            </Col>
            </Row>

            <Form.Group className="mb-3 col-md-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={loggedInUser.user.email}
                readOnly
              />
            </Form.Group>

            {employeeData && (
              <>
            <Form.Group className="mb-3 col-md-2">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="text"
                name="telefon"
                value={editedTelefon}
                onChange={handleTelefonChange}
                className={`form-control ${fieldErrors['editedTelefon'] ? 'is-invalid' : ''}`}
              />
            </Form.Group>
            <Form.Group className="mb-3 col-md-2">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="text"
                name="position"
                value={employeeData?.Position}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3 col-md-4">
              <Form.Label>Straße</Form.Label>
              <Form.Control
                type="text"
                name="straße"
                value={editedStrasse}
                onChange={handleStrasseChange}
                className={`form-control ${fieldErrors['editedStrasse'] ? 'is-invalid' : ''}`}
              />
            </Form.Group>

            <Row>

            <Col md={2}>
            <Form.Group className=" mb-3 col-md-10">
              <Form.Label >PLZ</Form.Label>
              <Form.Control
                type="text"
                name="plz"
                value={editedPLZ}
                onChange={handlePLZChange}
                className={`form-control ${fieldErrors['editedPLZ'] ? 'is-invalid' : ''}`}
              />
            </Form.Group>
            </Col>

            <Col md={2}>
            <FormGroup className=" mb-3 col-md-12">
            <Form.Label>Stadt</Form.Label>
              <Form.Control
                type="text"
                name="stadt"
                value={editedStadt}
                onChange={handleStadtChange}
                className={`form-control ${fieldErrors['editedStadt'] ? 'is-invalid' : ''}`}
              />
            </FormGroup>
            </Col>

            <Col md={2}>
            <FormGroup className=" mb-3 col-md-12">
            <Form.Label>Land</Form.Label>
              <Form.Control
                type="text"
                name="land"
                value={editedLand}
                onChange={handleLandChange}
                className={`form-control ${fieldErrors['editedLand'] ? 'is-invalid' : ''}`}
              />
            </FormGroup>
            </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Fähigkeiten</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                name="faehigkeiten"
                value={editedFaehigkeiten.join(", ")} 
                onChange={handleSkillsChange}
              />
            </Form.Group>
            
            <div className="text-end">
            <Button variant="primary" onClick={handleSaveClick}>
              Speichern
            </Button>{" "}
            <Button variant="secondary" onClick={handleCancelClick}>
              Abbrechen
            </Button>
            </div>
            </>
            )}
          </Form>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-borderless mb-0 text-muted">
                <tbody>
                  <tr>
                    <th scope="row">Benutzernummer</th>
                    <td>{loggedInUser.user.id}</td>
                  </tr>
                  <tr>
                    <th scope="row">Benutzername</th>
                    <td>{loggedInUser.user.username}</td>
                  </tr>
                  <tr>
                    <th scope="row">Vorname</th>
                    <td>{loggedInUser.user.firstName}</td>
                  </tr>
                  <tr>
                    <th scope="row">Nachname</th>
                    <td>{loggedInUser.user.lastName}</td>
                  </tr>
                  <tr>
                    <th scope="row">Email</th>
                    <td>{loggedInUser.user.email}</td>
                  </tr>
                  {employeeData && (
                    <>
                      <tr>
                        <th scope="row">Position</th>
                        <td>{employeeData.Position}</td>
                      </tr>
                      <tr>
                        <th scope="row">Telefon</th>
                        <td>{employeeData.Telefon}</td>
                      </tr>
                      <tr>
                        <th scope="row">Adresse</th>
                        <td>
                          {employeeData.Adresse.Strasse}, {employeeData.Adresse.PLZ}{" "}
                          {employeeData.Adresse.Stadt}, {employeeData.Adresse.Land}
                        </td>
                      </tr>
                      <tr className="mt-3 pt-2 border-top">
                        <th scope="row">Fähigkeiten</th>
                        <td>
                          {employeeData.Faehigkeiten.map((skill: string, index: number) => (
                            <span key={index} className="badge badge-soft-primary me-1">
                              {skill}
                            </span>
                          ))}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default PersonalDetails;
