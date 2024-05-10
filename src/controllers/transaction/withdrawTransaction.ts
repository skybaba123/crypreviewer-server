import Transaction from "@/models/transaction";
import User from "@/models/user";

const withdrawTransactionHandler = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send({ error: "No user found" });

    if (req.body.amount > user.accountBal)
      return res.status(400).send({ error: "Account balance not enough" });

    await User.findByIdAndUpdate(user._id, {
      $inc: { accountBal: -req.body.amount },
    });

    const newTransaction = await new Transaction({
      ownerId: user._id,
      amount: req.body.amount,
      status: "processing",
      type: "withdrawal",
      coin: req.body.coin,
      withdrawalWalletAddress: req.body.withdrawalWalletAddress,
    }).save();

    return res.status(200).send(newTransaction);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export default withdrawTransactionHandler;
