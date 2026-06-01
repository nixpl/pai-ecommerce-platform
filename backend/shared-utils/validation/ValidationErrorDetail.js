class ValidationErrorDetail {
  constructor(errorEnum, field, params = {}) {
    this.code = errorEnum.code;
    this.field = field;
    
    let finalMessage = errorEnum.message;
    for (const [key, value] of Object.entries(params)) {
      finalMessage = finalMessage.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    this.message = finalMessage;
  }
}

module.exports = { ValidationErrorDetail };