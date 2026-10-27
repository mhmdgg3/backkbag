import User from "../model/User.model.js";

export const createUser = async (firstName, lastName, email, password) => {
  const newUser = new User();
  newUser.firstName = firstName;
  newUser.lastName = lastName;
  newUser.email = email;
  newUser.password = password;

  newUser.save();

  return {
    firstName,
    lastName,
    email,
  };
};

export const findByEmail = async (email) => {
  const userExist = User.findOne({
    email: email,
  });

  return userExist;
};

export const users = async () => {
  const users = await User.find();
  return users;
};

export const user = async (id) => {
  const user = await User.findById(id);
  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
};

export const updatedUser = async (id , firstName, lastName, email, password) => {
  const updats = {};

  updats.firstName = firstName;
  updats.lastName = lastName;
  updats.email = email;
  updats.password = password;

  const user = await User.findByIdAndUpdate(
    id,
    { $set: updats },
    { returnDocument: "after", runValidators: true },
  );

  return user;
};
