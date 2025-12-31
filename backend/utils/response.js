export const success = (res, data, message = "Success", code = 200) => {
  res.status(code).json({ success: true, message, data });
};

export const error = (res, message = "Error", code = 500) => {
  res.status(code).json({ success: false, error: message });
};
