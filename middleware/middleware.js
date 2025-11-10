export const isAdminAuth = (req, res, next) => {
  if (req.session && req.session.admin) return next();
  res.status(401).json({ message: "Unauthorized. Please login as admin." });
};

export const isUserAuth = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  res.status(401).json({ message: "Unauthorized. Please login as user." });
};