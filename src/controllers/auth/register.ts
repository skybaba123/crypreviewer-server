import jwt from "jsonwebtoken";
import User, { createUser } from "@/models/user";
import Company from "@/models/company";
import sendEmail from "@/constants/sendEmail";
import { render } from "@react-email/render";
import CustomEmail from "@/email/CustomEmail";
import getPlanData from "@/constants/getPlanData";

const registerController = async (req: any, res: any) => {
  try {
    const companies = await Company.find({});
    const company = companies[0];
    if (!company) return res.status(404).send({ error: "No company info" });

    const requester = await User.findById(req.user._id);
    if (!requester) return res.status(404).send({ error: "No user found" });

    if (requester.role !== "admin")
      return res.status(400).send({ error: "Unauthorized access" });

    const userExistByEmail = await User.findOne({ email: req.body.email });
    if (userExistByEmail)
      return res.status(400).send({
        error: "A User already exists with this email. Login instead",
      });

    const userExistByUsername = await User.findOne({
      username: req.body.username,
    });
    if (userExistByUsername)
      return res.status(400).send({
        error: "A User already exists with this username. Choose another",
      });

    let referrerId;
    if ((req.body.referrerUsername as string).trim().length > 0) {
      const referrer = await User.findOne({
        username: (req.body.referrerUsername as string).toLowerCase(),
      });

      if (!referrer) {
        const msg =
          "No user found with this Username. Leave referral field empty if you have no referral";
        return res.status(404).send({ error: msg });
      }

      const percentRefBonus = 3 / 100;
      const refBonus = getPlanData(req.body.plan).price * percentRefBonus;
      await User.findByIdAndUpdate(referrer._id, {
        $inc: { referralBal: refBonus },
      });

      referrerId = referrer._id;
    } else {
      referrerId = undefined;
    }

    const oneDay = 86400000;
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      plan: req.body.plan,
      planExpiry: Date.now() + oneDay * req.body.planDuration,
      referrerId,
    };
    const savedUser = await createUser(newUser);

    const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRETE, {
      expiresIn: "1d",
    });
    const loginKey = jwt.sign(
      { username: savedUser.username },
      process.env.JWT_SECRETE
    );

    savedUser.loginKey = loginKey;
    savedUser.sessionToken = token;
    const updatedUser = await savedUser.save();

    if (company.welcomeEmail.status === "on") {
      const emailText = `Hello ${updatedUser.username}| ${company.welcomeEmail.emailMessage}| Here's your Login key: ${updatedUser.loginKey}| Do not share this key with anyone.`;
      const htmlData = render(CustomEmail({ company, message: emailText }));

      await sendEmail(
        updatedUser.email,
        "Welcome",
        emailText.replace(/\|/g, ""),
        htmlData,
        company
      );
    }

    return res.status(200).send({ user: updatedUser, loginKey });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export default registerController;
