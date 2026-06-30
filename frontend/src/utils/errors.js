export function toErrorState(err) {
  if (!err) return null;
  if (typeof err === 'string') return { message: err, details: [] };
  return {
    message: err.message || 'Wystąpił błąd',
    details: err.details || []
  };
}

export function partitionErrors(errorState) {
  if (!errorState) return { general: [], fields: {} };

  const details = errorState.details || [];
  if (!details.length) {
    return {
      general: errorState.message ? [errorState.message] : [],
      fields: {}
    };
  }

  const fields = {};
  const general = [];

  for (const detail of details) {
    if (detail.field) {
      fields[detail.field] = detail.message;
    } else {
      general.push(detail.message);
    }
  }

  return { general, fields };
}

export function inputClassName(baseClass, fieldErrors, fieldName) {
  return fieldErrors[fieldName] ? `${baseClass} input-invalid` : baseClass;
}
