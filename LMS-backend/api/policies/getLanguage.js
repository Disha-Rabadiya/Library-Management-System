module.exports.getLanguage = async (req, res, next) => {
  if (req.headers.lang) {
    req.setLocale(req.headers.lang);
  }
  next();
};
