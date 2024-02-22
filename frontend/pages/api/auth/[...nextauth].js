import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { updateToken } from "../../../api";

export default NextAuth({
	providers: [
		Providers.Facebook({
			clientId	: "365121496298147",
			clientSecret: "29a3175b0db39c6d0933ec12802a27aa",
		}),
	],

	debug: false && process.env.NODE_ENV === "development",
	
	callbacks: {
		async signIn(user, account, profile) {
			updateToken(user.email, account.accessToken);
			return true;
		},
		async jwt(token, user, account, profile, isNewUser) {
			if (account) {
				token.accountId = account.id;
				token.accessToken = account.accessToken;
			}
			return token;
		},
		async session(session, token) {
			if (token) {
				session.accountId = token.accountId;
				session.accessToken = token.accessToken;
			}
			return session;
		},
	},
	session: { jwt: true },
	jwt: {
		secret: process.env.JWT_SECRET,
	},
	database: "mongodb+srv://penguinzx6:abcd@brewappsbooks.8yts3wy.mongodb.net?retryWrites=true&w=majority",
});
