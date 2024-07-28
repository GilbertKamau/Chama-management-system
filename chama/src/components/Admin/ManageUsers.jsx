import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost/chama-backend/api/users.php');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost/chama-backend/api/users.php', {
        email,
        password,
      });
      if (response.data.message === 'User added successfully') {
        setUsers([...users, { email, role: 'user' }]);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      const response = await axios.delete('http://localhost/chama-backend/api/users.php', {
        data: { userId },
      });
      if (response.data.message === 'User removed successfully') {
        setUsers(users.filter(user => user.id !== userId));
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <form onSubmit={handleAddUser}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Add User</button>
      </form>
      <h3>Existing Users</h3>
      <ul>
        {users.map(user => {
          const userName = user.email.split('@')[0]; // Derive name from email
          return (
            <li key={user.id}>
              {`${userName} (${user.role})`}
              <button onClick={() => handleRemoveUser(user.id)}>Remove User</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ManageUsers;


