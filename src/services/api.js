// API Service for Hospital Management System
// Connects to Oracle DBMS via Express backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Call Error (${method} ${endpoint}):`, error);
    throw error;
  }
}

// Patients API
export const patientsAPI = {
  getAll: () => apiCall('/patients'),
  getById: (id) => apiCall(`/patients/${id}`),
  add: (patient) => apiCall('/patients', 'POST', patient),
  update: (id, patient) => apiCall(`/patients/${id}`, 'PUT', patient),
  delete: (id) => apiCall(`/patients/${id}`, 'DELETE'),
};

// Doctors API
export const doctorsAPI = {
  getAll: () => apiCall('/doctors'),
  getById: (id) => apiCall(`/doctors/${id}`),
  add: (doctor) => apiCall('/doctors', 'POST', doctor),
  update: (id, doctor) => apiCall(`/doctors/${id}`, 'PUT', doctor),
  delete: (id) => apiCall(`/doctors/${id}`, 'DELETE'),
};

// Appointments API
export const appointmentsAPI = {
  getAll: () => apiCall('/appointments'),
  getById: (id) => apiCall(`/appointments/${id}`),
  add: (appointment) => apiCall('/appointments', 'POST', appointment),
  update: (id, appointment) => apiCall(`/appointments/${id}`, 'PUT', appointment),
  delete: (id) => apiCall(`/appointments/${id}`, 'DELETE'),
};

// Medical Records API
export const medicalRecordsAPI = {
  getAll: () => apiCall('/medical-records'),
  getByPatientId: (patientId) => apiCall(`/medical-records/patient/${patientId}`),
  add: (record) => apiCall('/medical-records', 'POST', record),
};

// Departments API
export const departmentsAPI = {
  getAll: () => apiCall('/departments'),
  getById: (id) => apiCall(`/departments/${id}`),
};

