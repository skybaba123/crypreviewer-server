import sendEmail from "@/constants/sendEmail";
import CustomEmail from "@/email/CustomEmail";
import Company from "@/models/company";
import Transaction from "@/models/transaction";
import User from "@/models/user";
import { render } from "@react-email/render";

const earningTransactionHandler = async (req: any, res: any) => {
  try {
    const requester = await User.findById(req.user._id);
    if (!requester)
      return res.status(404).send({ error: "No user(requester) found" });

    if (requester.role !== "admin")
      return res.status(400).send({ error: "Unauthorized access" });

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).send({ error: "No user found" });

    await User.findByIdAndUpdate(user._id, {
      $inc: { accountBal: req.body.amount },
    });

    const newTransaction = await new Transaction({
      ownerId: user._id,
      amount: req.body.amount,
      status: "successful",
      type: "earning",
      coin: req.body.coin,
      coinAmount: req.body.coinAmount,
      earningPhraseKey: req.body.earningPhraseKey,
    }).save();

    const companies = await Company.find({});
    const company = companies[0];
    if (!company) return res.status(404).send({ error: "No user found" });

    const emailText = `Hello ${user.username},| You just earned ${company.currency.symbol}${newTransaction.amount}|Coin Name: ${newTransaction.coin}|Wallet Phrase: ${newTransaction.earningPhraseKey}`;
    const htmlData = render(CustomEmail({ company, message: emailText }));

    await sendEmail(
      user.email,
      "New Earning",
      emailText.replace(/\|/g, ""),
      htmlData,
      company
    );

    return res.status(200).send(newTransaction);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export default earningTransactionHandler;
