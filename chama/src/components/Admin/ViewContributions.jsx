import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewContributions = () => {
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await axios.get('http://localhost/chama-backend/api/contributions.php');
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

    fetchContributions();
  }, []);

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




