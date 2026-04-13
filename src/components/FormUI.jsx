// src/components/propertyFormUI/FormUI.jsx

/* ================= SECTION ================= */
export const Section = ({ title }) => (
  <div className="mb-6 mt-10">
    <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
      {title}
    </h2>
    <div className="h-[2px] w-10 bg-blue-500 mt-2 rounded-full"></div>
  </div>
);

/* ================= INPUT ================= */
export const Input = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  readOnly = false,
  error,
}) => (
  <div className="mb-5 group">
    <label
      htmlFor={id}
      className="block text-sm mb-1 font-medium text-gray-600 group-focus-within:text-blue-600 transition"
    >
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>

    <input
      id={id}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
      className={`
        w-full px-4 py-2.5 rounded-xl border bg-white
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        hover:border-gray-400
        ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300"}
      `}
    />

    {error && (
      <p className="text-red-500 text-xs mt-1 animate-pulse">
        {error}
      </p>
    )}
  </div>
);

/* ================= SELECT ================= */
export const Select = ({
  id,
  name,
  label,
  options,
  value,
  onChange,
  required = false,
}) => (
  <div className="mb-5 group">
    <label
      htmlFor={id}
      className="block text-sm mb-1 font-medium text-gray-600 group-focus-within:text-blue-600 transition"
    >
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>

    <select
      id={id}
      name={name}
      value={value || ""}
      onChange={onChange}
      required={required}
      className="
        w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        hover:border-gray-400
      "
    >
      <option value="">Select</option>

      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

/* ================= FILE UPLOAD ================= */
export const Upload = ({
  id,
  name,
  label,
  multiple = true,
  onChange,
}) => (
  <div className="mb-5">
    <label className="block text-sm mb-2 font-medium text-gray-600">
      {label}
    </label>

    <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center transition hover:border-blue-400 hover:bg-blue-50 cursor-pointer">
      <input
        id={id}
        name={name}
        type="file"
        multiple={multiple}
        onChange={onChange}
        className="hidden"
      />

      <label htmlFor={id} className="cursor-pointer text-sm text-gray-500">
        📁 Click to upload files or drag & drop
      </label>
    </div>
  </div>
);

/* ================= BUTTON ================= */
export const SaveButton = ({
  onClick,
  loading = false,
  text = "Save Property",
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className={`
      w-full py-3 rounded-xl font-semibold text-white
      transition-all duration-200 shadow-md
      ${loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 active:scale-95 hover:shadow-lg"}
    `}
  >
    {loading ? "Saving..." : text}
  </button>
);