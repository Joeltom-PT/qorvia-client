import React, { useState } from "react";

interface SelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onChange(e);
        }}
        placeholder={placeholder || "Select an option"}
        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
      />
      {filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[5px] shadow-md max-h-48 overflow-y-auto">
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onChange({ target: { name, value: option.value } })}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;