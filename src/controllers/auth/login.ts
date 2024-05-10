import jwt from "jsonwebtoken";
import User from "@/models/user";

const loginController = async (req: any, res: any) => {
  try {
    const user = await User.findOne({ loginKey: req.body.loginKey });
    if (!user) return res.status(404).send({ error: "No user found" });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRETE, {
      expiresIn: "1d",
    });
    user.sessionToken = token;
    const updatedUser = await user.save();

    return res.status(200).send(updatedUser);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export default loginController;
