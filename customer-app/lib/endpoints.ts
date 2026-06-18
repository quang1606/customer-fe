export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    REFRESH: "/api/auth/refresh",
  },
  PROFILE: {
    GET: "/api/profile",
    UPDATE: "/api/profile",
    PASSWORD: "/api/profile/password",
  },
  CUSTOMERS: {
    PROFILE: (id: string) => `/api/customers/profile/${id}`,
  },
  VOUCHERS: {
    AVAILABLE: "/api/vouchers/available",
    COLLECT: (id: string) => `/api/vouchers/collect/${id}`,
    LIST: "/api/vouchers/list",
    APPLICABLE: "/api/vouchers/applicable",
  },
  MISSIONS: {
    LIST: "/api/missions",
    CLAIM: "/api/missions/claim",
  },
  LEADERBOARD: "/api/leaderboard",
  INVOICES: "/api/invoices",
  PAYMENTS: "/api/payments",
  TRANSACTIONS: "/api/transactions",
};