import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  patientsAPI,
  doctorsAPI,
  appointmentsAPI,
  medicalRecordsAPI,
  departmentsAPI,
} from '../services/api';

const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Load initial data from backend
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [patientsData, doctorsData, appointmentsData, medicalRecordsData, departmentsData] = await Promise.all([
        patientsAPI.getAll(),
        doctorsAPI.getAll(),
        appointmentsAPI.getAll(),
        medicalRecordsAPI.getAll(),
        departmentsAPI.getAll(),
      ]);
      
      setPatients(patientsData || []);
      setDoctors(doctorsData || []);
      setAppointments(appointmentsData || []);
      setMedicalRecords(medicalRecordsData || []);
      setDepartments(departmentsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification('Error loading data from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Patient management
  const addPatient = useCallback(async (patient) => {
    setLoading(true);
    try {
      const newPatient = await patientsAPI.add(patient);
      setPatients(prev => [...prev, newPatient]);
      showNotification('Patient added successfully!', 'success');
      return newPatient;
    } catch (error) {
      showNotification('Error adding patient', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const updatePatient = useCallback(async (id, patient) => {
    setLoading(true);
    try {
      const updated = await patientsAPI.update(id, patient);
      setPatients(prev => prev.map(p => p.id === id ? updated : p));
      showNotification('Patient updated successfully!', 'success');
      return updated;
    } catch (error) {
      showNotification('Error updating patient', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const deletePatient = useCallback(async (id) => {
    setLoading(true);
    try {
      await patientsAPI.delete(id);
      setPatients(prev => prev.filter(p => p.id !== id));
      showNotification('Patient deleted successfully!', 'success');
    } catch (error) {
      showNotification('Error deleting patient', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Doctor management
  const addDoctor = useCallback(async (doctor) => {
    setLoading(true);
    try {
      const newDoctor = await doctorsAPI.add(doctor);
      setDoctors(prev => [...prev, newDoctor]);
      showNotification('Doctor added successfully!', 'success');
      return newDoctor;
    } catch (error) {
      showNotification('Error adding doctor', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const updateDoctor = useCallback(async (id, doctor) => {
    setLoading(true);
    try {
      const updated = await doctorsAPI.update(id, doctor);
      setDoctors(prev => prev.map(d => d.id === id ? updated : d));
      showNotification('Doctor updated successfully!', 'success');
      return updated;
    } catch (error) {
      showNotification('Error updating doctor', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const deleteDoctor = useCallback(async (id) => {
    setLoading(true);
    try {
      await doctorsAPI.delete(id);
      setDoctors(prev => prev.filter(d => d.id !== id));
      showNotification('Doctor deleted successfully!', 'success');
    } catch (error) {
      showNotification('Error deleting doctor', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Appointment management
  const addAppointment = useCallback(async (appointment) => {
    setLoading(true);
    try {
      const newAppointment = await appointmentsAPI.add(appointment);
      setAppointments(prev => [...prev, newAppointment]);
      showNotification('Appointment scheduled successfully!', 'success');
      return newAppointment;
    } catch (error) {
      showNotification('Error scheduling appointment', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const updateAppointment = useCallback(async (id, appointment) => {
    setLoading(true);
    try {
      const updated = await appointmentsAPI.update(id, appointment);
      setAppointments(prev => prev.map(a => a.id === id ? updated : a));
      showNotification('Appointment updated successfully!', 'success');
      return updated;
    } catch (error) {
      showNotification('Error updating appointment', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const deleteAppointment = useCallback(async (id) => {
    setLoading(true);
    try {
      await appointmentsAPI.delete(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
      showNotification('Appointment cancelled!', 'success');
    } catch (error) {
      showNotification('Error cancelling appointment', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Medical records
  const addMedicalRecord = useCallback(async (record) => {
    setLoading(true);
    try {
      const newRecord = await medicalRecordsAPI.add(record);
      setMedicalRecords(prev => [...prev, newRecord]);
      showNotification('Medical record added successfully!', 'success');
      return newRecord;
    } catch (error) {
      showNotification('Error adding medical record', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const value = {
    patients,
    doctors,
    appointments,
    medicalRecords,
    departments,
    loading,
    notification,
    addPatient,
    updatePatient,
    deletePatient,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addMedicalRecord,
  };

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within HospitalProvider');
  }
  return context;
};
