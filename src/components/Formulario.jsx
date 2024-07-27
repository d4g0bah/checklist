import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import './ChecklistForm.css';

// Importar imágenes
import KataleyaImg from '../Assets/Kataleya.jpg';
import BenjaminImg from '../Assets/Benjamin.jpg';
import FernandaImg from '../Assets/Fernanda.jpg';
import AntonellaImg from '../Assets/Antonella.jpg';
import VaniaImg from '../Assets/Vania.jpg';
import VladimirImg from '../Assets/Vladimir.jpg';
import XimenaImg from '../Assets/ximena.jpg';
import AndresImg from '../Assets/Andres.jpg';
import EvelinImg from '../Assets/evelin.png';

const ChecklistForm = () => {
  const [formData, setFormData] = useState({
    colacion: false,
    escuelaNuevaLuz: false,
    saludo: false,
    diaSemana: false,
    realizarActividad: false,
    recreo: false,
    almuerzo: false,
    aseo: false,
    irACasa: false,
  });

  const [attendance, setAttendance] = useState({
    kataleya: false,
    benjamin: false,
    fernanda: false,
    antonella: false,
    vania: false,
    vladimir: false,
  });

  const [professionalData, setProfessionalData] = useState([
    { name: 'Andrés Ardiles Vera', image: AndresImg, worked: false },
    { name: 'Ximena Rojas Romero', image: XimenaImg, worked: false },
    { name: 'Evelin Pizarro', image: EvelinImg, worked: false },
    { name: 'Barbara', image: null, worked: false },
  ]);

  // Mapear las imágenes importadas a los nombres
  const photos = {
    kataleya: KataleyaImg,
    benjamin: BenjaminImg,
    fernanda: FernandaImg,
    antonella: AntonellaImg,
    vania: VaniaImg,
    vladimir: VladimirImg,
    ximena: XimenaImg,
  };

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleAttendanceChange = (event) => {
    const { name, checked } = event.target;
    setAttendance({ ...attendance, [name]: checked });
  };

  const handleProfessionalChange = (index) => {
    const updatedProfessionalData = [...professionalData];
    updatedProfessionalData[index].worked = !updatedProfessionalData[index].worked;
    setProfessionalData(updatedProfessionalData);
  };

  const getCurrentDateAndDay = () => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('es-ES', options);
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };

  const handleExportChecklistPdf = () => {
    const doc = new jsPDF();
    const entries = Object.entries(formData);
    const text = entries.map(([key, value]) => `${key}: ${value ? 'Sí' : 'No'}`).join('\n');
    const dateAndDay = getCurrentDateAndDay();
    doc.text(`Fecha: ${dateAndDay}`, 10, 10);
    doc.text('Checklist Diario:', 10, 20);
    doc.text(text, 10, 30);
    doc.save('checklist.pdf');
  };

  const handleExportAttendancePdf = () => {
    const doc = new jsPDF();
    const dateAndDay = getCurrentDateAndDay();
    doc.text(`Fecha: ${dateAndDay}`, 10, 10);
    doc.text('Asistencia:', 10, 20);

    const attendanceEntries = Object.entries(attendance);
    let yOffset = 30;
    attendanceEntries.forEach(([key, value]) => {
      const image = photos[key];
      if (image) {
        doc.addImage(image, 'JPEG', 10, yOffset, 30, 30);
      }
      doc.text(`${key}: ${value ? 'Presente' : 'Ausente'}`, 50, yOffset + 10);
      yOffset += 40;
    });

    doc.save('asistencia.pdf');
  };

  const handleExportProfessionalsPdf = () => {
    const doc = new jsPDF();
    const dateAndDay = getCurrentDateAndDay();
    doc.text(`Fecha: ${dateAndDay}`, 10, 10);
    doc.text('Profesionales con los que se trabajó hoy:', 10, 20);

    let yOffset = 30;
    professionalData.forEach(({ name, image, worked }, index) => {
      if (image) {
        doc.addImage(image, 'JPEG', 10, yOffset, 30, 30);
      }
      doc.text(name, 50, yOffset + 10);
      doc.text(`Trabajó: ${worked ? 'Sí' : 'No'}`, 50, yOffset + 20);
      yOffset += 40;
    });

    doc.save('profesionales.pdf');
  };

  return (
    <div className="checklist-container">
      <div className="date-display">{getCurrentDateAndDay()}</div>
      <Form className="p-3">
        <h2>Checklist Diario</h2>
        {/* Checklist Form Groups */}
        {Object.keys(formData).map((item) => (
          <Form.Group key={item} controlId={`form${item}`}>
            <Form.Check
              type="checkbox"
              label={item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              name={item}
              checked={formData[item]}
              onChange={handleChange}
            />
          </Form.Group>
        ))}

        <Button variant="primary" onClick={handleExportChecklistPdf} className="mr-2">
          Exportar Checklist a PDF
        </Button>

        <h2 className="mt-4">Asistencia</h2>
        {Object.keys(attendance).map((person) => (
          <Form.Group key={person} controlId={`form${person}`}>
            <Form.Check
              type="checkbox"
              label={<div><img src={photos[person]} alt={person} className="photo" /> {person.replace(/^\w/, c => c.toUpperCase())}</div>}
              name={person}
              checked={attendance[person]}
              onChange={handleAttendanceChange}
            />
          </Form.Group>
        ))}

        <Button variant="primary" onClick={handleExportAttendancePdf}>
          Exportar Asistencia a PDF
        </Button>

        <h2 className="mt-4">Profesionales con los que se trabajó hoy:</h2>
        {professionalData.map(({ name, image }, index) => (
          <Form.Group key={name} controlId={`form${name}`}>
            <Form.Check
              type="checkbox"
              label={<div><img src={image} alt={name} className="photo" /> {name}</div>}
              name={name}
              checked={professionalData[index].worked}
              onChange={() => handleProfessionalChange(index)}
            />
          </Form.Group>
        ))}
        <Button variant="primary" onClick={handleExportProfessionalsPdf} className="mr-2 mt-2">
          Exportar Profesionales a PDF
        </Button>
      </Form>
    </div>
  );
};

export default ChecklistForm;
