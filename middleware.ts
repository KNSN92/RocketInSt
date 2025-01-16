import { withAuth } from "next-auth/middleware";

export default withAuth({
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        authorized({ req, token }) {
            if(token) return true;
            return false;
        }
    },
    pages: {
        signIn: "/signin"
    }
})

export const config = {
    matcher: ["/app"]
}
