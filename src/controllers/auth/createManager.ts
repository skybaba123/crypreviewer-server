import User from "@/models/user";
import jwt from "jsonwebtoken";

const createManagerHandler = async () => {
  try {
    const users = await User.find({});
    if (users.length <= 0) {
      const oneDay = 86400000;

      const newUser = {
        username: "admin",
        email: "admin@gmail.com",
        plan: "basic-lite",
        planExpiry: Date.now() + oneDay * 30,
        role: "admin",
        manager: "yes",
        loginKey: process.env.MANAGER_INITIAL_LOGIN_KEY,
      };

      const savedUser = await new User(newUser).save();

      const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRETE, {
        expiresIn: "1d",
      });

      savedUser.sessionToken = token;
      const updatedUser = await savedUser.save();
      console.log(updatedUser);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export default createManagerHandler;
