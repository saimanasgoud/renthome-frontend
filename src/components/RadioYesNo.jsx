function RadioYesNo({ label, value, onChange }) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">{label}</p>

      <div className="flex grid gridcols-1 gap-2">
        {["Yes", "No"].map((opt) => (
          <label
            key={opt}
            className={`flex items-center gap-2 cursor-pointer
              ${value === opt ? "text-indigo-700 font-semibold" : "text-gray-600"}`}
          >
            <input
              type="radio"
              name={label}
              value={opt}
              checked={value === opt}
              onChange={(e) => onChange(e.target.value)}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

export default RadioYesNo;