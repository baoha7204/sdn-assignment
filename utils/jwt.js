import jwt from "jsonwebtoken";

export class JWT {
  static generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
  }

  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { userId: decoded.userId, valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}
