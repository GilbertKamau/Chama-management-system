import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewContributions = () => {
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    // Fetch contributions data
    const fetchContributions = async () => {
      try {
        const response = await axios.get('http://localhost/chama-backend/api/contributions.php');
        setContributions(response.data);
      } catch (error) {
        console.error('Error fetching contributions:', error);
      }
    };

    fetchContributions();
  }, []);

  return (
    <div>
      <h2>View Contributions</h2>
      <ul>
        {contributions.map((contribution) => (
          <li key={contribution.id}>{`User: ${contribution.user}, Amount: ${contribution.amount}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default ViewContributions;
