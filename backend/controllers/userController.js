export const getProfile = async (req, res) => {
  res.json({ message: "Profile accessed", user: req.user });
};
