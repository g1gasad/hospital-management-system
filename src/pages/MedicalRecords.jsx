import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Plus, X } from 'lucide-react';
import './MedicalRecords.css';

export default function MedicalRecords() {
  const { medicalRecords, patients, doctors, addMedicalRecord, loading } = useHospital();
  const [showForm, setShowForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    diagnosis: '',
    treatment: '',
    notes: '',
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
    addMedicalRecord(formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      diagnosis: '',
      treatment: '',
      notes: '',
    });
    setShowForm(false);
  };

  const getPatientName = (patientId) => {
    return patients.find(p => p.id == patientId)?.name || 'Unknown';
  };

  const getDoctorName = (doctorId) => {
    return doctors.find(d => d.id == doctorId)?.name || 'Unknown';
  };

  const patientRecords = selectedPatientId
    ? medicalRecords.filter(r => r.patientId == selectedPatientId)
    : medicalRecords;

  return (
    <div className="medical-records-container">
      <div className="records-header">
        <h1>Medical Records</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          <Plus size={20} />
          Add Record
        </button>
      </div>

      {/* Filter */}
      <div className="filter-box">
        <label>Filter by Patient:</label>
        <select
          value={selectedPatientId || ''}
          onChange={(e) => setSelectedPatientId(e.target.value ? parseInt(e.target.value) : null)}
        >
          <option value="">All Patients</option>
          {patients.map(patient => (
            <option key={patient.id} value={patient.id}>{patient.name}</option>
          ))}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className="form-container">
          <div className="form-card">
            <div className="form-header">
              <h2>Add Medical Record</h2>
              <button className="btn-close" onClick={resetForm}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group full">
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

                <div className="form-group full">
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

                <div className="form-group full">
                  <label>Diagnosis *</label>
                  <input
                    type="text"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group full">
                  <label>Treatment</label>
                  <input
                    type="text"
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group full">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="4"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Add Record'}
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Records List */}
      <div className="records-container">
        {patientRecords.length > 0 ? (
          <div className="records-list">
            {patientRecords.map(record => (
              <div key={record.id} className="record-card">
                <div className="record-header">
                  <h3>Medical Record #{record.id}</h3>
                  <span className="record-date">{record.date}</span>
                </div>
                <div className="record-content">
                  <div className="content-row">
                    <strong>Patient:</strong>
                    <span>{getPatientName(record.patientId)}</span>
                  </div>
                  <div className="content-row">
                    <strong>Doctor:</strong>
                    <span>{getDoctorName(record.doctorId)}</span>
                  </div>
                  <div className="content-row">
                    <strong>Diagnosis:</strong>
                    <span>{record.diagnosis}</span>
                  </div>
                  <div className="content-row">
                    <strong>Treatment:</strong>
                    <span>{record.treatment || 'N/A'}</span>
                  </div>
                  <div className="content-row full">
                    <strong>Notes:</strong>
                    <span>{record.notes || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No medical records found</p>
        )}
      </div>
    </div>
  );
}
