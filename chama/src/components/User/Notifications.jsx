import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost/chama-backend/api/notifications.php?user_id=${user.id}`);
          setNotifications(response.data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <div>
      <h2>Loan Status Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{`Loan status: ${notification.status}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
