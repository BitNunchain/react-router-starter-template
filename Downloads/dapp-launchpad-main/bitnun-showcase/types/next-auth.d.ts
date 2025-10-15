import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    stripeCustomerId?: string
    subscriptionStatus?: string
    totalSpent?: number
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      stripeCustomerId?: string
      subscriptionStatus?: string
      totalSpent?: number
    }
  }
}