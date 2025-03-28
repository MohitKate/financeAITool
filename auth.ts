import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import z from "zod";
import { User } from "./app/lib/definitions";
import Users from "./app/../pages/Models/User";
import connectToDatabase from "./app/lib/mongoose";
import bcrypt from "bcrypt";

async function getUser(email: string): Promise<User | undefined> {
  try {
    await connectToDatabase();

    // Fetch all revenue data from the collection
    const allData = await Users.find({ email: email }).exec();
    console.log(allData);
    return allData[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials): Promise<any> {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = password === user.password;
         // const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
