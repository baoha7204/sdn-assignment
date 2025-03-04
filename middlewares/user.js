import Member from "../models/member.js";

const bindReqUser = async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  const user = await Member.findById(req.session.user._id);

  req.user = user | null;
  next();
};

export default bindReqUser;
