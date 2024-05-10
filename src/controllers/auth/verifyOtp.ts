import sendEmail from "@/constants/sendEmail";
import CustomEmail from "@/email/CustomEmail";
import Company from "@/models/company";
import User from "@/models/user";
import { render } from "@react-email/render";
import jwt from "jsonwebtoken";

const verifyOtpHandler = async (req: any, res: any) => {
  try {
    const companies = await Company.find({});
    const company = companies[0];
    if (!company) return res.status(404).send({ error: "No user found" });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send({ error: "No user found" });

    if (!user.verificationCode || !user.verificationCodeExpiry)
      return res.status(400).send({ error: "Unauthorized access code-N/A" });

    if (user.verificationCode !== req.body.otp)
      return res.status(400).send({ error: "Invalid otp code" });

    if (Date.now() > user.verificationCodeExpiry)
      return res.status(400).send({ error: "The code you entered is expired" });

    const loginKey = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRETE
    );

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        loginKey,
        verificationCode: undefined,
        verificationCodeExpiry: undefined,
      },
      { new: true }
    );

    const emailText = `Hello ${user.username}| A new login key has been generated.| Here's your new Login key: ${updatedUser.loginKey}| Do not share this key with anyone.`;
    const htmlData = render(CustomEmail({ company, message: emailText }));

    await sendEmail(
      user.email,
      "New Login Key",
      emailText.replace(/\|/g, ""),
      htmlData,
      company
    );

    return res.status(200).send({ loginKey: updatedUser.loginKey });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export default verifyOtpHandler;
