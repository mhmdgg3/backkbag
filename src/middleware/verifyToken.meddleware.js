import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      code: "ACCESS_TOKEN_MISSING",
      message: "Authentication required",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.type !== "access") {
      return res.status(401).json({
        success: false,
        code: "INVALID_ACCESS_TOKEN",
        message: "Invalid access token",
      });
    }

    req.user = { id: payload.userId };
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        code: "ACCESS_TO;EN_EXPIERD",
        mesaage: "access token expires",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid access token",
    });
  }
};
