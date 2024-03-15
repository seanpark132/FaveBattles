export default function SelectDropdown({
  options,
  value,
  onChangeHandle,
  placeholder,
}) {
  return (
    <select
      className="rounded-lg p-2"
      value={value}
      onChange={(e) => onChangeHandle(e)}
      placeholder={placeholder}
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}
