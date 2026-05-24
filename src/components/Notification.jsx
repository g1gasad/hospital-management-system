import { useHospital } from '../context/HospitalContext';
import './Notification.css';

export default function Notification() {
  const { notification } = useHospital();

  if (!notification) return null;

  return (
    <div className={`notification notification-${notification.type}`}>
      {notification.message}
    </div>
  );
}
