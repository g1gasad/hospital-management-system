import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HospitalProvider } from './context/HospitalContext';
import Navigation from './components/Navigation';
import Notification from './components/Notification';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import MedicalRecords from './pages/MedicalRecords';
import Departments from './pages/Departments';
import './App.css';

function App() {
  return (
    <HospitalProvider>
      <Router>
        <Navigation />
        <Notification />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/departments" element={<Departments />} />
        </Routes>
      </Router>
    </HospitalProvider>
  );
}

export default App;