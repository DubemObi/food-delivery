const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { JWT_SECRET_KEY } = process.env;

const maxAge = 3 * 24 * 60 * 60;
exports.createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

exports.auth = (request, response, next) => {
  const token = request.cookies.jwt;

  if (token) {
    jwt.verify(token, JWT_SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        response.status(401).json({ error: err.message });
      } else {
        const user = await User.findById(decodedToken.id);
        // id = user;
        request.user = user;
      }
      next();
    });
  } else {
    response.status(401).json({ message: "Sign In" });
    response.redirect("./login");
  }
};

exports.checkUser = (...roles) => {
  return async (request, response, next) => {
    const token = request.cookies.jwt;
    if (!token) {
      return response.status(401).json({
        message: "You need to SignIn",
      });
    }
    jwt.verify(token, JWT_SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        response.status(401).json({ error: err.message });
      } else {
        const user = await User.findById(decodedToken.id);
        request.user = user;
      }
    });

    if (!request.user.role.includes(...roles)) {
      return response.status(401).json({
        message: "Unauthorized user",
      });
    }
    next();
  };
};
