import User from "@/models/user";

const getUserById = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).send({ error: "No user found" });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export default getUserById;
