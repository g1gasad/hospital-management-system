import { useHospital } from '../context/HospitalContext';
import { Building2 } from 'lucide-react';
import './Departments.css';

export default function Departments() {
  const { departments, doctors } = useHospital();

  const getDoctorsInDepartment = (deptId) => {
    return doctors.filter(d => d.department == deptId);
  };

  return (
    <div className="departments-container">
      <div className="departments-header">
        <h1>Hospital Departments</h1>
        <p>Overview of all departments and their heads</p>
      </div>

      <div className="departments-grid">
        {departments.map(dept => {
          const deptDoctors = getDoctorsInDepartment(dept.id);
          return (
            <div key={dept.id} className="department-card">
              <div className="dept-icon">
                <Building2 size={32} />
              </div>
              <h3>{dept.name}</h3>
              <div className="dept-info">
                <p><strong>Department Head:</strong></p>
                <p className="head-name">{dept.head}</p>
              </div>
              <div className="dept-doctors">
                <strong>Doctors ({deptDoctors.length}):</strong>
                {deptDoctors.length > 0 ? (
                  <ul>
                    {deptDoctors.map(doc => (
                      <li key={doc.id}>{doc.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-doctors">No doctors assigned</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
