import React from 'react';

const Greeting = ({ email }) => {
  // Derive the name from the email
  const name = email.split('@')[0];
  // Capitalize the first letter of the name
  const capitalizedFirstLetterName = name.charAt(0).toUpperCase() + name.slice(1);

  return <h2>Welcome, {capitalizedFirstLetterName}!</h2>;
};

export default Greeting;
