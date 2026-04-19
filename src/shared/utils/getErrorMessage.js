const getErrorMessage = (error, fallbackMessage = 'Something went wrong. Please try again.') => {
  const responseMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message;

  if (typeof responseMessage === 'string' && responseMessage.trim()) {
    return responseMessage.trim();
  }

  return fallbackMessage;
};

export default getErrorMessage;
