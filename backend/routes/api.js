import express from 'express';
import * as patientController from '../controllers/patientController.js';
import * as doctorController from '../controllers/doctorController.js';
import * as appointmentController from '../controllers/appointmentController.js';
import * as medicalRecordController from '../controllers/medicalRecordController.js';
import * as departmentController from '../controllers/departmentController.js';

const router = express.Router();

// Patient routes
router.get('/patients', patientController.getAllPatients);
router.get('/patients/:id', patientController.getPatientById);
router.post('/patients', patientController.addPatient);
router.put('/patients/:id', patientController.updatePatient);
router.delete('/patients/:id', patientController.deletePatient);

// Doctor routes
router.get('/doctors', doctorController.getAllDoctors);
router.get('/doctors/:id', doctorController.getDoctorById);
router.post('/doctors', doctorController.addDoctor);
router.put('/doctors/:id', doctorController.updateDoctor);
router.delete('/doctors/:id', doctorController.deleteDoctor);

// Appointment routes
router.get('/appointments', appointmentController.getAllAppointments);
router.get('/appointments/:id', appointmentController.getAppointmentById);
router.post('/appointments', appointmentController.addAppointment);
router.put('/appointments/:id', appointmentController.updateAppointment);
router.delete('/appointments/:id', appointmentController.deleteAppointment);

// Medical Record routes
router.get('/medical-records', medicalRecordController.getAllRecords);
router.get('/medical-records/patient/:patientId', medicalRecordController.getRecordsByPatientId);
router.post('/medical-records', medicalRecordController.addRecord);

// Department routes
router.get('/departments', departmentController.getAllDepartments);
router.get('/departments/:id', departmentController.getDepartmentById);

export default router;
