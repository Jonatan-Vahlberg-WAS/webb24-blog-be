function adminMiddleware(req,res,next) {
  const isAdmin = req.isAdmin;
  if(!isAdmin) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  next()
}

module.exports = adminMiddleware
