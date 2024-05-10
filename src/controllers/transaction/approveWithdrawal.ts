import sendEmail from "@/constants/sendEmail";
import CustomEmail from "@/email/CustomEmail";
import Company from "@/models/company";
import Transaction from "@/models/transaction";
import User from "@/models/user";
import { render } from "@react-email/render";

const approveWithdrawalHandler = async (req: any, res: any) => {
  try {
    const requester = await User.findById(req.user._id);
    if (!requester)
      return res.status(404).send({ error: "No user(requester) found" });

    if (requester.role !== "admin")
      return res.status(400).send({ error: "Unauthorized access" });

    const transaction = await Transaction.findById(req.body.transactionId);
    if (!transaction)
      return res.status(404).send({ error: "Transaction not found" });

    const user = await User.findById(transaction.ownerId);
    if (!user) return res.status(404).send({ error: "No user found" });

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transaction._id,
      { status: "successful" },
      { new: true }
    );

    const companies = await Company.find({});
    const company = companies[0];
    if (!company) return res.status(404).send({ error: "No user found" });

    const emailText = `Hello ${user.username},| Your withdrawal of ${company.currency.symbol}${updatedTransaction.amount} have been approved and funds has been transfered to your provided wallet.`;
    const htmlData = render(CustomEmail({ company, message: emailText }));

    await sendEmail(
      user.email,
      "Withdrawal Approved",
      emailText.replace(/\|/g, ""),
      htmlData,
      company
    );

    return res.status(200).send(updatedTransaction);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export default approveWithdrawalHandler;
