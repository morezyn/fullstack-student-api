module.exports = (req, res, next) => {
  if (req.body === undefined || req.body === null || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'A JSON request body is required' });
  }
  return next();
};
