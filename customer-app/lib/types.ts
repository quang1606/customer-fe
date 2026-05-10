export type CustomerTier = "ALL" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";
export type CustomerStatus = "ACTIVE" | "LOCKED";
export type CustomerVoucherStatus = "AVAILABLE" | "USED" | "EXPIRED";
export type DiscountType = "FIXED" | "PERCENT";
export type CreatorType = "SYSTEM" | "PARTNER";
export type CustomerMissionStatus = "IN_PROGRESS" | "COMPLETED" | "CLAIMED";
export type TargetType = "AMOUNT" | "COUNT";
export type RewardType = "POINT" | "VOUCHER";

export interface ApiResponse<T> {
  status: number;
  code: string;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  currentPage?: number;
  pageSize?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles: string[];
}

export interface CustomerProfile {
  id: number;
  userId: string;
  fullName: string;
  balance: number;
  totalPoints: number;
  tier: CustomerTier;
  status: CustomerStatus;
  createdAt: string;
}

export interface AvailableVoucher {
  id: number;
  voucherCode: string;
  voucherName: string;
  description: string;
  customerTier: CustomerTier;
  discountType: DiscountType;
  discountValue: string;
  maxDiscount: string;
  minOrderValue: string;
  totalStock: number;
  availableStock: number;
  maxCollect: number;
  startDate: number;
  endDate: number;
  status: string;
  createdAt: number;
  collected: boolean;
}

export interface MyVoucher {
  id: number;
  customerId: number;
  voucherId: number;
  availableUsage: number;
  voucherCode: string;
  nameStore: string | null;
  creatorType: CreatorType;
  status: CustomerVoucherStatus;
  obtainedAt: string;
  usedAt: string | null;
  expiredAt: string;
  isCollected: boolean;
}

export interface ApplicableVoucher {
  voucherId: number;
  voucherCode: string;
  voucherName: string;
  description: string;
  discountType: DiscountType;
  discountValue: string;
  maxDiscount: string;
  minOrderValue: string;
  availableStock: number;
  nameStore: string;
  creatorType: CreatorType;
  applicable: boolean;
  reason: string | null;
}

export interface VoucherRequest {
  voucherCode: string;
  voucherName: string;
  description: string;
  discountType: DiscountType;
  discountValue: string;
  maxDiscount: string;
  minOrderValue: string;
  totalStock: number;
  availableStock: number;
  startDate: number;
  endDate: number;
  voucherStatus: string;
  nameStore: string;
}

export interface Mission {
  missionId: number;
  missionName: string;
  missionDescription: string;
  targetValue: number;
  targetType: TargetType;
  rewardType: RewardType;
  rewardValue: string;
  partnerId: number;
  startDate: number;
  endDate: number;
  taskStatus: string;
  currentProgress: number;
  status: CustomerMissionStatus;
  voucherRequest: VoucherRequest | null;
}

export interface ClaimMissionInfo {
  missionId: number;
  requestId: string;
  missionName: string;
  missionDescription: string;
  targetValue: number;
  rewardType: RewardType;
  rewardValue: string;
  voucherDetail: null;
  partnerId: number;
  startDate: string;
  endDate: string;
  status: string;
}

export interface ClaimVoucherDetail {
  id: number;
  voucherCode: string;
  requestId: string;
  voucherName: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount: number;
  minOrderValue: number | null;
  totalStock: number;
  availableStock: number;
  maxCollect: number;
  startDate: string;
  endDate: string;
  status: string;
}

export interface MissionClaimResult {
  mission: ClaimMissionInfo;
  voucherDetail: ClaimVoucherDetail | null;
}

export interface MissionsResponse {
  missions: Mission[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface LeaderboardEntry {
  customerId: number;
  customerName: string;
  totalPoints: number;
  rank: number;
}

export interface LeaderboardResponse {
  topCustomers: LeaderboardEntry[];
  currentCustomer: LeaderboardEntry;
}

export interface Invoice {
  id: number;
  title: string;
  nameStore: string;
  amount: string;
  createdAt: number;
  updatedAt: number;
}

export interface PaymentRequest {
  invoiceId?: number;
  voucherId?: number;
  orderAmount: number;
}

export interface PaymentResult {
  transactionId: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  pointsEarned: number;
  status: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user?: User;
  userId?: string;
  customerId?: string;
}
