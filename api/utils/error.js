// Function to create an error with a status code and message
export const errorHandler = (statusCode, message) => {
  const error = new Error(); // Create a new error object
  error.statusCode = statusCode; // Set the status code for the error
  error.message = message; // Set the message for the error
  return error; // Return the error object
};
