import { getAuth } from "@clerk/express";

const userAuth = (req, res, next) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  req.userId = userId;
  next();
};

export default userAuth;
