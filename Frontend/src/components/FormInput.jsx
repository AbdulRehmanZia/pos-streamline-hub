const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  className = '',
  ...props
}) => (
  <div className={`space-y-2 ${className}`}>
    {label && (
      <label className="block text-sm font-medium text-[#1C3333]">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-[#1C3333]/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1C3333] focus:border-[#1C3333] text-[#1C3333] bg-white ${error ? 'border-red-500' : ''}`}
      required={required}
      {...props}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export default FormInput;