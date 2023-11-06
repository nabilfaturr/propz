import jwt from "jsonwebtoken";
import { errorHandler } from "./error.util.js";

export const verifyToken = (req, res, next) => {
  console.log(`ini`, req.body);
  const token = req.cookies.access_token;
  console.log(token);
  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return next(errorHandler(403, "forbidden"));
    req.user = user;
    next();
  });
};
