import React, { useState } from 'react';
import './index.css';

function Demo() {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    // Here you can add logic to delete files or perform any other actions
    // For demonstration purposes, let's use a timeout to simulate a delay
    setTimeout(() => {
      setIsDeleting(false);
    }, 3000); // Simulating a 3-second delay
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? 'Deleting...' : 'Delete Files'}
      </button>
      {isDeleting && (
        <div className="truck-animation">
          {/* Animation of a truck */}
          <img alt="demo" src='https://cdn.pixabay.com/photo/2021/12/01/17/15/semi-trailer-truck-6838645_1280.png' />
        </div>
      )}
    </div>
  );
}

export default Demo;
