import jwt from "jsonwebtoken";

export const genrateAccessToken = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, type: "access" },
    process.env.JWT_SECRET,
    { expiresIn: "10000" },
  );

  return accessToken;
};
export const genrateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    { userId: user._id, type: "refresh" },
    process.env.JWT_SECRET,
    { expiresIn: 7 * 24 * 60 * 60 * 1000 },
  );
  return refreshToken;
};
