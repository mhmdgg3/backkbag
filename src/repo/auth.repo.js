import User from "../model/User.model.js";

export const findUserByEmail = async (email) => {
  const user = await User.findOne({
    email: email,
  });

  return user;
};
export const findUserByPassword = async (comparePassword) => {
  const user = await User.findOne({
    password: comparePassword,
  });

  return user;
};


