import React from 'react';

interface CheckboxProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  isDisabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({ isChecked, onChange, isDisabled = false }) => {
  const handleClick = () => {
    if (!isDisabled) {
      onChange(!isChecked);
    }
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      disabled={isDisabled}
      onClick={handleClick}
      className={`
        relative w-5 h-5 rounded border-2 transition-all duration-75
        ${isChecked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500'}
        ${!isDisabled && !isChecked ? 'hover:bg-gray-50' : ''}
      `}
    >
      {isChecked && (
        <svg
          className="absolute inset-0 w-full h-full text-white p-0.5"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="4,10 8,14 16,6" />
        </svg>
      )}
    </button>
  );
};
