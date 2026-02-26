// Input validation
export function validateFormInputs(formData) {
  const errors = [];

  const nights = parseInt(formData.nights);
  if (isNaN(nights) || nights < 1) {
    errors.push('Nights must be at least 1');
  }
  if (nights > 365) {
    errors.push('Nights cannot exceed 365');
  }

  const validWeather = ['warm', 'medium', 'cold'];
  if (!validWeather.includes(formData.weather)) {
    errors.push('Invalid weather selection');
  }

  const validAccommodation = ['hotel', 'hostel', 'mountain_cabin', 'holiday_home'];
  if (!validAccommodation.includes(formData.accommodation)) {
    errors.push('Invalid accommodation type');
  }

  return errors;
}

export function showValidationErrors(errors) {
  if (errors.length > 0) {
    console.error('Validation errors:', errors);
    // Could display to user via toast notification
    return false;
  }
  return true;
}
