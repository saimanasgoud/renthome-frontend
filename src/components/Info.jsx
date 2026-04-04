import React from "react";

/**
 * Reusable Info row component
 * Handles:
 * - null / undefined
 * - empty strings
 * - numbers (0 allowed)
 * - booleans
 * - arrays
 * - objects
 * - JSX
 * - formatting options
 */

export default function Info({
  label,
  value,
  fallback = "—",
  highlight = false,
  prefix = "",
  suffix = "",
  className = "",
}) {
  /* ❌ Skip invalid labels */
  if (!label) return null;

  /* ❌ Handle empty values safely */
  const isEmpty =
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0);

  if (isEmpty) return null;

  /* 🔁 Normalize value */
  let displayValue = value;

  /* 🟢 Boolean handling */
  if (typeof value === "boolean") {
    displayValue = value ? "Yes" : "No";
  }

  /* 🟡 Array handling */
  if (Array.isArray(value)) {
    displayValue = value.join(", ");
  }

  /* 🔵 Object handling */
  if (typeof value === "object" && !React.isValidElement(value)) {
    displayValue = JSON.stringify(value);
  }

  /* 🟣 Number handling (allow 0) */
  if (typeof value === "number") {
    displayValue = value;
  }

  /* 🎨 Styling */
  const valueClasses = `
    font-medium
    ${highlight ? "text-green-700" : "text-gray-800"}
  `;

  return (
    <div
      className={`flex justify-between items-start gap-4 py-1 ${className}`}
    >
      <span className="text-sm text-gray-500 whitespace-nowrap">
        {label}
      </span>

      <span className={`${valueClasses} text-right break-words`}>
        {prefix}
        {displayValue || fallback}
        {suffix}
      </span>
    </div>
  );
}
