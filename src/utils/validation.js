export const validateProperty = (data, requiredFields) => {
  const errors = {};

  requiredFields.forEach((field) => {
    if (!data[field] || data[field].toString().trim() === "") {
      errors[field] = "This field is required";
    }
  });

  // Mobile validation
  if (data.mobile && !/^[6-9]\d{9}$/.test(data.mobile)) {
    errors.mobile = "Enter valid 10-digit mobile number";
  }

  // Rent validation
  if (data.rent && data.rent <= 0) {
    errors.rent = "Rent must be greater than 0";
  }

  return errors;
};