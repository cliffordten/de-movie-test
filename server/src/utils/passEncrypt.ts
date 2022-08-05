import bcrypt from "bcrypt";
const saltRounds = 10;

export const generateHash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

export const compareHash = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
