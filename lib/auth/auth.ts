import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../data/prisma";
import { magicLink } from "better-auth/plugins";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url, metadata }) => {
        const from = process.env.RESEND_FROM_EMAIL;
        if (!from) {
          console.error("RESEND_FROM_EMAIL is not set in environment variables.");
          return
        };

        const callbackURL = metadata?.hash ? `${url}#${metadata.hash}` : url

        try {
          const { data, error } = await resend.emails.send({
            from,
            to: email,
            subject: "Your Magic Link",
            html: `<p>Click the link below to sign in:</p><p><a href="${callbackURL}">Sign In</a></p>`
            // html: `<p>Click the link below to sign in:</p><p><a href="${url}">Sign In</a></p>`
          })

          if (error) {
            console.error("Error sending email:", error);
            return
          };
        } catch (error) {
          console.error("Error sending email:", error);
          return
        }
      },
    }),
  ],
});