import React from 'react';
import './Spinner.scss';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'medium' }) => {
  return (
    <div className={`spinner spinner-${size}`}>
      <div className="spinner-loader" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
