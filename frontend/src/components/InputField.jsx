import React from "react";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  PhotoIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";

const InputField = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  icon,
  required = false,
  className = "",
  error,
  options = [],
  disabled = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const Icon = () => {
    switch (icon) {
      case "user": return <UserIcon className={`h-6 w-6 mr-2 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />;
      case "email": return <EnvelopeIcon className={`h-6 w-6 mr-2 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />;
      case "password": return <LockClosedIcon className={`h-6 w-6 mr-2 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />;
      case "phone": return <PhoneIcon className={`h-6 w-6 mr-2 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />;
      case "photo": return <PhotoIcon className={`h-6 w-6 mr-2 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />;
      case "building": return <BuildingOfficeIcon className={`h-6 w-6 mr-2 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />;
      case "map": return <MapPinIcon className={`h-6 w-6 mr-2 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />;
      default: return null;
    }
  };

  const getBorderColor = () => {
    if (error) return 'border-red-500';
    if (isFocused) return 'border-blue-500';
    if (value && value.trim() !== '') return 'border-green-500';
    return 'border-gray-300';
  };

  if (type === "file") {
    return (
      <div className={`mb-4 ${className}`}>
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {placeholder}
          {required && <span className="text-red-500"></span>}
        </label>
        
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className={`w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 ${getBorderColor()} ${
              isFocused ? 'ring-2 ring-blue-500' : ''
            }`}>
              {value ? (
                <img 
                  src={typeof value === 'string' ? value : URL.createObjectURL(value)} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <PhotoIcon className="h-12 w-12" />
                  <span className="text-sm mt-2">Ajouter une photo</span>
                </div>
              )}
            </div>
            
            <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-md">
              <PhotoIcon className="h-5 w-5" />
              <input
                type="file"
                name={name}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="hidden"
                accept="image/*"
                {...props}
              />
            </label>
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className={`mb-4 ${className}`}>
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {placeholder}
          {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className={`border-2 rounded-lg px-4 py-3 transition-all ${getBorderColor()} ${
          isFocused ? 'ring-1 ring-blue-500' : ''
        }`}>
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full outline-none text-lg placeholder-gray-300"
            rows={props.rows || 3}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className={`mb-4 ${className}`}>
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {placeholder}
          {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className={`relative border-2 rounded-lg transition-all ${getBorderColor()} ${
          isFocused ? 'ring-1 ring-blue-500' : ''
        }`}>
          <select
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-4 py-3 outline-none text-lg appearance-none bg-transparent placeholder-gray-300"
            required={required}
            disabled={disabled}
            {...props}
          >
            <option value="" disabled selected>{placeholder}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-lg font-medium text-gray-700 mb-2">
        {placeholder}
        {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className={`flex items-center border-2 rounded-lg px-4 py-3 transition-all ${getBorderColor()} ${
        isFocused ? 'ring-1 ring-blue-500' : ''
      }`}>
        <Icon />
        <input
          type={type === "password" && showPassword ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 outline-none text-lg placeholder-gray-300"
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          {...props}
        />
        
        {type === "password" && (
          <button
            type="button"
            className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1" // Empêche le focus sur le bouton
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;