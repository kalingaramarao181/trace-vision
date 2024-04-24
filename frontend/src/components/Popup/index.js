import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import './index.css'; // Import CSS file for styling

const ModalPopup = (props) => {
    const {openStatus} = props
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Popup
        open={isOpen}
        onClose={() => setIsOpen(false)}
        closeOnDocumentClick
        contentStyle={{
          maxWidth: '400px',
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
          transition: 'opacity 0.5s ease-in-out' // Transition effect for opacity
        }}
      >
        {close => (
          <div className={`modal ${isOpen ? 'open' : ''}`}>
            <button className="close" onClick={close}>
              &times;
            </button>
            <div className="header">Interactive Popup</div>
            <div className="content">
              This is an interactive popup!
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default ModalPopup;
