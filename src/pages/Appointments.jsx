import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import './Appointments.css';

export default function Appointments() {
  const { appointments, patients, doctors, addAppointment, updateAppointment, deleteAppointment, loading } = useHospital();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    status: 'Scheduled',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateAppointment(editingId, formData);
    } else {
      addAppointment(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      date: '',
      time: '',
      reason: '',
      status: 'Scheduled',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (appointment) => {
    setFormData(appointment);
    setEditingId(appointment.id);
    setShowForm(true);
  };

  const getPatientName = (patientId) => {
    return patients.find(p => p.id == patientId)?.name || 'Unknown';
  };

  const getDoctorName = (doctorId) => {
    return doctors.find(d => d.id == doctorId)?.name || 'Unknown';
  };

  const filteredAppointments = filterStatus === 'All'
    ? appointments
    : appointments.filter(a => a.status === filterStatus);

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <h1>Appointment Management</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          <Plus size={20} />
          Schedule Appointment
        </button>
      </div>

      {/* Filter */}
      <div className="filter-box">
        <label>Filter by Status:</label>
        <div className="filter-buttons">
          {['All', 'Scheduled', 'Completed', 'Cancelled'].map(status => (
            <button
              key={status}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="form-container">
          <div className="form-card">
            <div className="form-header">
              <h2>{editingId ? 'Edit Appointment' : 'Schedule New Appointment'}</h2>
              <button className="btn-close" onClick={resetForm}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Patient *</label>
                  <select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>{patient.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Doctor *</label>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time *</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group full">
                  <label>Reason for Visit</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option>Scheduled</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : editingId ? 'Update Appointment' : 'Schedule Appointment'}
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="appointments-list-container">
        {filteredAppointments.length > 0 ? (
          <div className="appointments-list">
            {filteredAppointments.map(appointment => (
              <div key={appointment.id} className="appointment-item">
                <div className="appointment-header">
                  <h3>Appointment #{appointment.id}</h3>
                  <span className={`status-badge status-${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </span>
                </div>
                <div className="appointment-details-grid">
                  <div className="detail-item">
                    <strong>Patient:</strong>
                    <span>{getPatientName(appointment.patientId)}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Doctor:</strong>
                    <span>{getDoctorName(appointment.doctorId)}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Date:</strong>
                    <span>{appointment.date}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Time:</strong>
                    <span>{appointment.time}</span>
                  </div>
                  <div className="detail-item full">
                    <strong>Reason:</strong>
                    <span>{appointment.reason || 'N/A'}</span>
                  </div>
                </div>
                <div className="appointment-actions">
                  <button
                    className="btn-icon edit"
                    onClick={() => handleEdit(appointment)}
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="btn-icon delete"
                    onClick={() => {
                      if (confirm('Cancel this appointment?')) {
                        deleteAppointment(appointment.id);
                      }
                    }}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No appointments found</p>
        )}
      </div>
    </div>
  );
}
