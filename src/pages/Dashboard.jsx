import { useHospital } from '../context/HospitalContext';
import { Users, Stethoscope, Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const { patients, doctors, appointments, medicalRecords } = useHospital();

  const stats = [
    { icon: Users, label: 'Total Patients', value: patients.length, color: '#3498db', link: '/patients' },
    { icon: Stethoscope, label: 'Total Doctors', value: doctors.length, color: '#2ecc71', link: '/doctors' },
    { icon: Calendar, label: 'Appointments', value: appointments.length, color: '#e74c3c', link: '/appointments' },
    { icon: FileText, label: 'Medical Records', value: medicalRecords.length, color: '#f39c12', link: '/medical-records' },
  ];

  const upcomingAppointments = appointments
    .filter(apt => apt.status === 'Scheduled')
    .slice(0, 5);

  const getPatientName = (patientId) => {
    return patients.find(p => p.id === patientId)?.name || 'Unknown';
  };

  const getDoctorName = (doctorId) => {
    return doctors.find(d => d.id === doctorId)?.name || 'Unknown';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome to Hospital Management System</p>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link to={stat.link} key={index} className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                  <Icon size={32} color="white" />
                </div>
                <div className="stat-content">
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-value">{stat.value}</div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Upcoming Appointments */}
        <div className="section">
          <div className="section-header">
            <h2>Upcoming Appointments</h2>
            <Link to="/appointments" className="view-all">View All</Link>
          </div>

          {upcomingAppointments.length > 0 ? (
            <div className="appointments-list">
              {upcomingAppointments.map(apt => (
                <div key={apt.id} className="appointment-item">
                  <div className="appointment-info">
                    <div className="appointment-patient">
                      <strong>{getPatientName(apt.patientId)}</strong>
                      <span className="appointment-doctor">{getDoctorName(apt.doctorId)}</span>
                    </div>
                    <div className="appointment-details">
                      <span className="appointment-date">{apt.date}</span>
                      <span className="appointment-time">{apt.time}</span>
                    </div>
                  </div>
                  <span className={`appointment-status status-${apt.status.toLowerCase()}`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No upcoming appointments</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/patients" className="action-button action-primary">
              <Users size={20} />
              <span>Add New Patient</span>
            </Link>
            <Link to="/doctors" className="action-button action-primary">
              <Stethoscope size={20} />
              <span>Add New Doctor</span>
            </Link>
            <Link to="/appointments" className="action-button action-primary">
              <Calendar size={20} />
              <span>Schedule Appointment</span>
            </Link>
            <Link to="/medical-records" className="action-button action-primary">
              <FileText size={20} />
              <span>Add Medical Record</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
