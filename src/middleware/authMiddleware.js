const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const protect = async (req, res, next) => {

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {

    token = req.headers.authorization.split(" ")[1];

    try {

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id
        }
      });

      if (!user) {
        return res.status(401).json({
          message: "User not found"
        });
      }

      req.user = user;

      next();

    } catch (err) {

      return res.status(401).json({
        message: "Invalid Token"
      });

    }

  } else {

    return res.status(401).json({
      message: "No Token"
    });

  }

};

module.exports = {
  protect
};