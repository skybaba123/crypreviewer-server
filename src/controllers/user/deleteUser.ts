import Transaction from "@/models/transaction";
import User from "@/models/user";

const deleteUserHandler = async (req: any, res: any) => {
  try {
    const requester = req.user;
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).send({ error: "No user found" });

    if (
      requester._id.toString() !== user._id.toString() &&
      requester.role !== "admin"
    ) {
      return res.status(401).send({ error: "Unauthorized access" });
    }

    if (
      user.role === "admin" &&
      user._id.toString() !== requester._id.toString() &&
      requester.manager !== "yes"
    ) {
      return res
        .status(401)
        .send({ error: "Only a Manager can delete other Admins" });
    }

    if (user.manager === "yes" && requester.manager === "yes") {
      const allUsers = await User.find({});
      if (allUsers.length > 1)
        return res.status(400).send({
          error:
            "As the manager, you cannot delete yourself. Except you're the last user. Kindly delete every other user, before deleting yourself.",
        });
    }

    if (req.body.loginKey !== requester.loginKey)
      return res.status(401).send({ error: "Login Key Mismatch" });

    await Transaction.deleteMany({ ownerId: user._id });
    await User.findByIdAndDelete(req.body.userId);

    return res.status(200).send({ msg: "User deleted" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export default deleteUserHandler;
