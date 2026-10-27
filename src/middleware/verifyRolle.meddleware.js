import User from "../model/User.model.js";

export const verifyRolle = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user not found",
    
      });
    }
    const userRolle = user.rolle;
    if (!userRolle || userRolle !== "admin") {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }
    req.rolle = userRolle.rolle;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
