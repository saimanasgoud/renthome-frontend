// // src/components/propertyFormUI/FormUI.jsx

// export const Section = ({ title }) => (
//   <h2 className="text-lg font-semibold mb-4 mt-6">
//     {title}
//   </h2>
// );

// export const Input = ({ id,label, type = "text", value, onChange }) => (
//   <>
//     <label className="block text-sm mb-1">{label}</label>
//     <input
//       id={id}
//       type={type}
//       value={value}
//       onChange={onChange}
//       className="w-full mb-4 px-4 py-3 border rounded-lg"
//     />
//   </>
// );

// export const Select = ({ label, options, value, onChange }) => (
//   <>
//     <label className="block text-sm mb-1">{label}</label>
//     <select value={value} onChange={onChange} className="w-full mb-4 px-4 py-3 border rounded-lg">
//       <option value="">Select</option>
//       {options.map((o) => (
//         <option key={o}>{o}</option>
//       ))}
//     </select>
//   </>
// );

// export const Upload = ({ label, onChange }) => (
//   <>
//     <label className="block text-sm mb-1">{label}</label>
//     <input type="file" multiple onChange={onChange} className="mb-4" />
//   </>
// );

// export const SaveButton = ({ onClick }) => (
//   <button type="button" onClick={onClick} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold">
//     Save Property
//   </button>
// );


// src/components/propertyFormUI/FormUI.jsx

export const Section = ({ title }) => (
  <h2 className="text-lg font-semibold mb-4 mt-8 border-b pb-2">
    {title}
  </h2>
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
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm mb-1 font-medium">
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
      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2
        ${error ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"}
      `}
    />

    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm mb-1 font-medium">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>

    <select
      id={id}
      name={name}
      value={value || ""}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm mb-1 font-medium">
      {label}
    </label>

    <input
      id={id}
      name={name}
      type="file"
      multiple={multiple}
      onChange={onChange}
      className="w-full text-sm border rounded-lg p-2"
    />
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
    className={`w-full py-3 rounded-xl font-semibold transition
      ${loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 text-white"}
    `}
  >
    {loading ? "Saving..." : text}
  </button>
);
