const ApiResponse = (res, statusCode, data = null, message) => {
  return res.status(statusCode).json({
    statusCode,
    data,
    message,
    success: statusCode < 400,
  });
};

export default ApiResponse;
