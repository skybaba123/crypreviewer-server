import generateOtp from "@/constants/generateOtp";
import User from "@/models/user";
import Company from "@/models/company";
import sendEmail from "@/constants/sendEmail";
import { render } from "@react-email/render";
import ResetPasswordEmail from "@/email/ResetPasswordEmail";
import CustomEmail from "@/email/CustomEmail";

const forgotKeyHandler = async (req: any, res: any) => {
  try {
    const oneHour = 3600000;
    const companies = await Company.find({});
    const company = companies[0];
    if (!company) return res.status(404).send({ error: "No user found" });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send({ error: "No user found" });

    const otp = generateOtp();
    const expiry = Date.now() + oneHour;

    user.verificationCode = otp;
    user.verificationCodeExpiry = expiry;
    await user.save();

    const emailText = `Hello ${user.username}| Someone recently requested a login Key change for your account, ignore if this is not you| Here's your 6-digit code: ${otp}. Do not share this code with any one| Code will expire in one hour`;
    const htmlData = render(CustomEmail({ company, message: emailText }));

    const emailResponse = await sendEmail(
      user.email,
      "Reset Login Key",
      emailText.replace(/\|/g, ""),
      htmlData,
      company
    );

    if (emailResponse.status === "not-sent") {
      return res.status(400).send({ error: emailResponse.statusMessage });
    }

    return res.status(200).send();
  } catch (error) {
    return res.status(500).send({ error: error.meessge });
  }
};

export default forgotKeyHandler;
