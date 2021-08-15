import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import axios from 'axios'

export default NextAuth({
  debug: true,
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          const res = await axios.post("http://localhost:5000/auth/login", credentials)
          const user = res.data

          return user
        } catch (error) {
          // Return null if user data could not be retrieved
          console.error(error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt(token, user, account) {
      // Initial call
      if (user && account) {
        const { accessToken, ...userData } = user
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken.token}`
        return {
          user: { ...userData },
          accessToken: accessToken.token,
          accessTokenExpires: Date.now() + accessToken.expiresIn * 1000,
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        // VALID TOKEN
        return token
      }

      // EXPIRED TOKEN
      delete axios.defaults.headers.common['Authorization']
      return {
        expired: true
      }
    },
    async session(session, token) {
      if (token.expired) {
        return {}
      }

      session.user = token.user
      return session
    }
  },
  events: {
    async signOut() {
      delete axios.defaults.headers.common['Authorization']
    }
  }
})