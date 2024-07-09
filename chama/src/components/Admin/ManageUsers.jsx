import React, { useState } from 'react';

const ManageUsers = () => {
  const [email, setEmail] = useState('');

  const handleAddUser = (e) => {
    e.preventDefault();
    // Handle add user logic
  };

  const handleRemoveUser = (email) => {
    // Handle remove user logic
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <form onSubmit={handleAddUser}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button type="submit">Add User</button>
      </form>
      <button onClick={() => handleRemoveUser(email)}>Remove User</button>
    </div>
  );
};

export default ManageUsers;