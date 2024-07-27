import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import './ChecklistForm.css';
import Weather from './Weather'; // Asegúrate de tener la ruta correcta

import KataleyaImg from '../Assets/Kataleya.jpg';
import BenjaminImg from '../Assets/Benjamin.jpg';
import FernandaImg from '../Assets/Fernanda.jpg';
import AntonellaImg from '../Assets/Antonella.jpg';
import VaniaImg from '../Assets/Vania.jpg';
import VladimirImg from '../Assets/Vladimir.jpg';
import XimenaImg from '../Assets/ximena.jpg';
import AndresImg from '../Assets/Andres.jpg';
import EvelinImg from '../Assets/evelin.png';

import ColacionImg from '../Assets/colacion.png';
import EscuelaNuevaLuzImg from '../Assets/escuela-nueva-luz.jpg';
import AlmuerzoImg from '../Assets/almuerzo.png';
import CalendarioImg from '../Assets/calendario.png';
import IrACasaImg from '../Assets/ir-a-casa.png';
import RealizarActividadImg from '../Assets/realizar-actividad.png';
import RecreoImg from '../Assets/recreo.png';
import SaludoImg from '../Assets/saludo.png';
import AseoImg from '../Assets/aseo.webp';

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

  const photos = {
    kataleya: KataleyaImg,
    benjamin: BenjaminImg,
    fernanda: FernandaImg,
    antonella: AntonellaImg,
    vania: VaniaImg,
    vladimir: VladimirImg,
    ximena: XimenaImg,
  };

  const checklistPhotos = {
    colacion: ColacionImg,
    escuelaNuevaLuz: EscuelaNuevaLuzImg,
    almuerzo: AlmuerzoImg,
    diaSemana: CalendarioImg,
    irACasa: IrACasaImg,
    realizarActividad: RealizarActividadImg,
    recreo: RecreoImg,
    saludo: SaludoImg,
    aseo: AseoImg,
  };

  const formatLabel = (str) => {
    switch (str) {
      case 'colacion':
        return 'Colacion';
      case 'escuelaNuevaLuz':
        return 'Escuela Nueva Luz';
      case 'saludo':
        return 'Saludo';
      case 'diaSemana':
        return 'Día Semana';
      case 'realizarActividad':
        return 'Realizar Actividad';
      case 'recreo':
        return 'Recreo';
      case 'almuerzo':
        return 'Almuerzo';
      case 'aseo':
        return 'Aseo';
      case 'irACasa':
        return 'Ir A Casa';
      default:
        return str.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
  };

  const getCurrentDateAndTime = () => {
    const date = new Date();
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).replace(/^\w/, c => c.toUpperCase());
  };

  const createPdf = (title, data, formatItem, imageMap) => {
    const doc = new jsPDF();
    const dateAndTime = getCurrentDateAndTime();
    doc.text(`Fecha y hora: ${dateAndTime}`, 10, 10);
    doc.text(title, 10, 20);

    let yOffset = 30;
    const pageBreak = (key) => key === 'almuerzo' || key === 'aseo';

    data.forEach(item => {
        if (imageMap && imageMap[item.key]) {
            if (pageBreak(item.key) && yOffset > 250) {
                doc.addPage(); // Agrega una nueva página si el offset supera el límite
                yOffset = 10; // Reinicia el offset para la nueva página
            }
            doc.addImage(imageMap[item.key], 'JPEG', 10, yOffset, 30, 30);
            yOffset += 35;
        }
        formatItem(item, doc, yOffset);
        yOffset += 10;
        
        if (pageBreak(item.key) && yOffset > 250) {
            doc.addPage(); // Agrega una nueva página si el offset supera el límite
            yOffset = 10; // Reinicia el offset para la nueva página
        }
    });

    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
};


  const handleExportChecklistPdf = () => {
    const entries = Object.entries(formData).map(([key, value]) => ({ key, value }));
    createPdf('Checklist Diario', entries, (item, doc, yOffset) => {
      doc.text(`${formatLabel(item.key)}: ${item.value ? 'Sí' : 'No'}`, 50, yOffset);
    }, checklistPhotos);
  };

  const handleExportAttendancePdf = () => {
    const entries = Object.entries(attendance).map(([key, value]) => ({ key, value }));
    createPdf('Asistencia', entries, (item, doc, yOffset) => {
      doc.text(`${formatLabel(item.key)}: ${item.value ? 'Presente' : 'Ausente'}`, 50, yOffset + 10);
    }, photos);
  };

  const handleExportProfessionalsPdf = () => {
    createPdf('Profesionales con los que se trabajó hoy:', professionalData, (item, doc, yOffset) => {
      doc.text(item.name, 50, yOffset + 10);
      doc.text(`Trabajó: ${item.worked ? 'Sí' : 'No'}`, 50, yOffset + 20);
    }, photos);
  };

  return (
    <div className="checklist-container">
      <div className="date-display">{getCurrentDateAndTime()}</div>
      <Weather apiKey="d76ef65d65b5b2b6aa1247136644bef3" />
      <Form className="p-3">
        <h2>Checklist Diario</h2>
        {Object.keys(formData).map((item) => (
          <Form.Group key={item} controlId={`form${item}`}>
            <Form.Check
              type="checkbox"
              label={
                <div>
                  <img src={checklistPhotos[item]} alt={item} className="photo" />
                  {formatLabel(item)}
                </div>
              }
              name={item}
              checked={formData[item]}
              onChange={({ target: { name, checked } }) => setFormData({ ...formData, [name]: checked })}
            />
          </Form.Group>
        ))}
        <Button variant="primary" onClick={handleExportChecklistPdf} className="mr-2">
          Exportar Checklist a PDF
        </Button>
        <br></br>
        <h2 className="mt-4">Asistencia</h2>
        {Object.keys(attendance).map((person) => (
          <Form.Group key={person} controlId={`form${person}`}>
            <Form.Check
              type="checkbox"
              label={<div><img src={photos[person]} alt={person} className="photo" /> {formatLabel(person)}</div>}
              name={person}
              checked={attendance[person]}
              onChange={({ target: { name, checked } }) => setAttendance({ ...attendance, [name]: checked })}
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
              onChange={() => {
                const updatedData = [...professionalData];
                updatedData[index].worked = !updatedData[index].worked;
                setProfessionalData(updatedData);
              }}
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
