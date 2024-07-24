import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const ViewContributions = () => {
  const { user } = useAuth();
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        let response;
        if (user && user.role === 'admin') {
          response = await axios.get('http://localhost/chama-backend/api/contributions.php');
        } else if (user && user.id) {
          response = await axios.get(`http://localhost/chama-backend/api/contributions.php?user_id=${user.id}`);
        } else {
          throw new Error('User ID is required');
        }
        
        if (Array.isArray(response.data)) {
          setContributions(response.data);
        } else {
          console.error('Invalid data format:', response.data);
          setContributions([]);
        }
      } catch (error) {
        console.error('Error fetching contributions:', error);
        setContributions([]);
      }
    };

    if (user) {
      fetchContributions();
    }
  }, [user]);

  return (
    <div>
      <h2>View Contributions</h2>
      <ul>
        {contributions.map((contribution) => (
          <li key={contribution.id}>
            {`User: ${contribution.user_id}, Amount: ${contribution.amount}, Date: ${contribution.contribution_date}, Description: ${contribution.description}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewContributions;



