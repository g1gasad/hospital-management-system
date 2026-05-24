import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import './Doctors.css';

export default function Doctors() {
  const { doctors, departments, addDoctor, updateDoctor, deleteDoctor, loading } = useHospital();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    department: '',
    email: '',
    phone: '',
    availability: '',
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
      updateDoctor(editingId, formData);
    } else {
      addDoctor(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      department: '',
      email: '',
      phone: '',
      availability: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (doctor) => {
    setFormData(doctor);
    setEditingId(doctor.id);
    setShowForm(true);
  };

  const getDepartmentName = (deptId) => {
    return departments.find(d => d.id == deptId)?.name || 'N/A';
  };

  const filteredDoctors = doctors.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="doctors-container">
      <div className="doctors-header">
        <h1>Doctor Management</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          <Plus size={20} />
          Add Doctor
        </button>
      </div>

      {/* Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search doctors by name or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Form */}
      {showForm && (
        <div className="form-container">
          <div className="form-card">
            <div className="form-header">
              <h2>{editingId ? 'Edit Doctor' : 'Add New Doctor'}</h2>
              <button className="btn-close" onClick={resetForm}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Specialization *</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group full">
                  <label>Availability</label>
                  <input
                    type="text"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    placeholder="e.g., Mon-Fri 9AM-5PM"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : editingId ? 'Update Doctor' : 'Add Doctor'}
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctors Grid */}
      <div className="doctors-grid">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map(doctor => (
            <div key={doctor.id} className="doctor-card">
              <div className="doctor-card-header">
                <h3>{doctor.name}</h3>
                <div className="card-actions">
                  <button
                    className="btn-icon edit"
                    onClick={() => handleEdit(doctor)}
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-icon delete"
                    onClick={() => {
                      if (confirm(`Delete doctor ${doctor.name}?`)) {
                        deleteDoctor(doctor.id);
                      }
                    }}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="doctor-info">
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Department:</strong> {getDepartmentName(doctor.department)}</p>
                <p><strong>Email:</strong> {doctor.email}</p>
                <p><strong>Phone:</strong> {doctor.phone}</p>
                <p><strong>Availability:</strong> {doctor.availability}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state">No doctors found</p>
        )}
      </div>
    </div>
  );
}
