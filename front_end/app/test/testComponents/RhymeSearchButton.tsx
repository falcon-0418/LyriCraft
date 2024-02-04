"use client"
import React from 'react';

const RhymeSearchButton = () => {
  const handleClick = () => {
    console.log('RhymeSearchButton clicked');
    alert('RhymeSearchButton clicked');
  };

  return (
    <button onClick={handleClick} className="your-button-styles">
      韻検索
    </button>
  );
};

export default RhymeSearchButton;
