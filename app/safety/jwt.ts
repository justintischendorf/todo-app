import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";
const JWT_EXPIRES_IN = "1d";

export async function createJWT(userId: string): Promise<string> {
  try {
    const token = jwt.sign({ sub: userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    return token;
  } catch (error) {
    console.error("Error creating JWT:", error);
    throw new Error("Failed to create JWT");
  }
}
