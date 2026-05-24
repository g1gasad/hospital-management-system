import { Link } from 'react-router-dom';
import { Menu, X, Hospital } from 'lucide-react';
import { useState } from 'react';
import './Navigation.css';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Hospital size={28} />
          <span>HMS</span>
        </Link>

        <button
          className="hamburger"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/patients" className="nav-link" onClick={() => setIsOpen(false)}>
              Patients
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/doctors" className="nav-link" onClick={() => setIsOpen(false)}>
              Doctors
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/appointments" className="nav-link" onClick={() => setIsOpen(false)}>
              Appointments
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/medical-records" className="nav-link" onClick={() => setIsOpen(false)}>
              Medical Records
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/departments" className="nav-link" onClick={() => setIsOpen(false)}>
              Departments
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
