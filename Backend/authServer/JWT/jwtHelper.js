import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

export const createJWT = (user) => {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET
  );
  //TODO: add third argument for REFRESH TOKEN
  return accessToken;
};

//MIDDLEWARE FUNCTION
export const verifyAccessToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(400).json({ error: "user not authenticated" });
  }
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (verified) {
      req.userId = verified.id;
      return next();
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};
