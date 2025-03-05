import Member from "../models/member.js";

const bindReqUser = async (req, res, next) => {
  if (!req.session?.user) {
    req.user = null;
    res.locals.user = null;
  } else {
    const user = await Member.findById(req.session.user._id).catch(next);
    req.user = user || null;
    res.locals.user = req.user;
  }

  next();
};

export default bindReqUser;
