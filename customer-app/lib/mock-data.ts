import {
  LeaderboardResponse,
  MissionsResponse,
  Invoice,
  CustomerProfile,
  AvailableVoucher,
  MyVoucher,
  ApplicableVoucher,
  User,
  PaginatedData,
  Transaction,
} from "./types";

export const MOCK_USER: User = {
  id: "user-001",
  username: "nguyenvana",
  email: "nguyenvana@email.com",
  firstName: "Nguyễn",
  lastName: "Văn A",
  phone: "0901234567",
  roles: ["CUSTOMER"],
};

export const MOCK_CUSTOMER_PROFILE: CustomerProfile = {
  id: 99,
  userId: "user-001",
  fullName: "Nguyễn Văn A",
  balance: 2500000,
  totalPoints: 2500,
  tier: "GOLD",
  status: "ACTIVE",
  createdAt: "2024-01-15T10:00:00Z",
};

export const MOCK_LEADERBOARD: LeaderboardResponse = {
  topCustomers: [
    { customerId: 1, customerName: "Nguyễn Văn A", totalPoints: 12500, rank: 1 },
    { customerId: 2, customerName: "Trần Thị B", totalPoints: 9800, rank: 2 },
    { customerId: 3, customerName: "Lê Văn C", totalPoints: 8200, rank: 3 },
    { customerId: 4, customerName: "Phạm Thị D", totalPoints: 7100, rank: 4 },
    { customerId: 5, customerName: "Hoàng Văn E", totalPoints: 6300, rank: 5 },
    { customerId: 6, customerName: "Vũ Thị F", totalPoints: 5500, rank: 6 },
    { customerId: 7, customerName: "Đặng Văn G", totalPoints: 4800, rank: 7 },
    { customerId: 8, customerName: "Bùi Thị H", totalPoints: 4200, rank: 8 },
    { customerId: 9, customerName: "Ngô Văn I", totalPoints: 3600, rank: 9 },
    { customerId: 10, customerName: "Dương Thị K", totalPoints: 3100, rank: 10 },
  ],
  currentCustomer: { customerId: 99, customerName: "Bạn", totalPoints: 2500, rank: 15 },
};

export const MOCK_MISSIONS: MissionsResponse = {
  missions: [
    {
      missionId: 1,
      missionName: "Chi tiêu 500K",
      missionDescription: "Thanh toán tổng cộng 500.000đ để nhận thưởng",
      targetValue: 500000,
      targetType: "AMOUNT",
      rewardType: "POINT",
      rewardValue: "200",
      partnerId: 1,
      startDate: Date.now() - 7 * 86400000,
      endDate: Date.now() + 23 * 86400000,
      taskStatus: "ACTIVE",
      currentProgress: 320000,
      status: "IN_PROGRESS",
      voucherRequest: null,
    },
    {
      missionId: 2,
      missionName: "Thanh toán 5 lần",
      missionDescription: "Thực hiện 5 giao dịch thanh toán thành công",
      targetValue: 5,
      targetType: "COUNT",
      rewardType: "VOUCHER",
      rewardValue: "Giảm 50K",
      partnerId: 1,
      startDate: Date.now() - 3 * 86400000,
      endDate: Date.now() + 27 * 86400000,
      taskStatus: "ACTIVE",
      currentProgress: 5,
      status: "COMPLETED",
      voucherRequest: {
        voucherCode: "MISSION50K",
        voucherName: "Giảm 50K đơn từ 200K",
        description: "Giảm 50.000đ cho đơn hàng từ 200.000đ",
        discountType: "FIXED",
        discountValue: "50000",
        maxDiscount: "50000",
        minOrderValue: "200000",
        totalStock: 100,
        availableStock: 50,
        startDate: Date.now(),
        endDate: Date.now() + 30 * 86400000,
        voucherStatus: "ACTIVE",
        nameStore: "Tất cả",
      },
    },
    {
      missionId: 3,
      missionName: "Chi tiêu 1 triệu",
      missionDescription: "Thanh toán tổng cộng 1.000.000đ trong tháng",
      targetValue: 1000000,
      targetType: "AMOUNT",
      rewardType: "POINT",
      rewardValue: "500",
      partnerId: 2,
      startDate: Date.now() - 10 * 86400000,
      endDate: Date.now() + 20 * 86400000,
      taskStatus: "ACTIVE",
      currentProgress: 1000000,
      status: "CLAIMED",
      voucherRequest: null,
    },
  ],
  totalElements: 3,
  totalPages: 1,
  currentPage: 0,
  pageSize: 20,
};

export const MOCK_INVOICES: PaginatedData<Invoice> = {
  data: [
    { id: 1, title: "Cà phê sáng", nameStore: "Highland Coffee", amount: "85000", createdAt: Date.now() - 2 * 86400000, updatedAt: Date.now() - 2 * 86400000 },
    { id: 2, title: "Ăn trưa", nameStore: "Phở 24", amount: "120000", createdAt: Date.now() - 1 * 86400000, updatedAt: Date.now() - 1 * 86400000 },
    { id: 3, title: "Mua sắm", nameStore: "Vinmart", amount: "350000", createdAt: Date.now() - 3 * 86400000, updatedAt: Date.now() - 3 * 86400000 },
    { id: 4, title: "Xăng xe", nameStore: "Petrolimex", amount: "200000", createdAt: Date.now() - 4 * 86400000, updatedAt: Date.now() - 4 * 86400000 },
    { id: 5, title: "Đồ uống", nameStore: "Starbucks", amount: "150000", createdAt: Date.now() - 5 * 86400000, updatedAt: Date.now() - 5 * 86400000 },
  ],
  totalElements: 5,
  totalPages: 1,
};

export const MOCK_AVAILABLE_VOUCHERS: PaginatedData<AvailableVoucher> = {
  data: [
    {
      id: 1, voucherCode: "GIAM20", voucherName: "Giảm 20% đơn hàng", description: "Giảm 20% tối đa 50K cho đơn từ 100K",
      customerTier: "ALL", discountType: "PERCENT", discountValue: "20", maxDiscount: "50000", minOrderValue: "100000",
      totalStock: 500, availableStock: 320, maxCollect: 1, startDate: Date.now() - 5 * 86400000, endDate: Date.now() + 25 * 86400000,
      status: "ACTIVE", createdAt: Date.now() - 10 * 86400000, collected: false,
    },
    {
      id: 2, voucherCode: "GIAM30K", voucherName: "Giảm 30K", description: "Giảm 30.000đ cho đơn từ 150K",
      customerTier: "SILVER", discountType: "FIXED", discountValue: "30000", maxDiscount: "30000", minOrderValue: "150000",
      totalStock: 200, availableStock: 80, maxCollect: 2, startDate: Date.now() - 2 * 86400000, endDate: Date.now() + 28 * 86400000,
      status: "ACTIVE", createdAt: Date.now() - 5 * 86400000, collected: false,
    },
    {
      id: 3, voucherCode: "GOLD50", voucherName: "Ưu đãi Gold 50K", description: "Giảm 50K cho thành viên Gold trở lên",
      customerTier: "GOLD", discountType: "FIXED", discountValue: "50000", maxDiscount: "50000", minOrderValue: "200000",
      totalStock: 100, availableStock: 45, maxCollect: 1, startDate: Date.now(), endDate: Date.now() + 30 * 86400000,
      status: "ACTIVE", createdAt: Date.now(), collected: true,
    },
  ],
  totalElements: 3,
  totalPages: 1,
};

export const MOCK_MY_VOUCHERS: PaginatedData<MyVoucher> = {
  data: [
    {
      id: 10, voucherStatus: "AVAILABLE", availableUsage: 1, voucherCode: "GOLD50", voucherName: "Ưu đãi Gold 50K",
      description: "Giảm 50K cho thành viên Gold trở lên", customerTier: "GOLD", discountType: "FIXED",
      discountValue: "50000", maxDiscount: "50000", minOrderValue: "200000", totalStock: 100, availableStock: 45,
      maxCollect: 1, startDate: new Date(Date.now()).toISOString(), endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      status: "ACTIVE", createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), collected: true,
    },
    {
      id: 11, voucherStatus: "USED", availableUsage: 0, voucherCode: "WELCOME10", voucherName: "Chào mừng thành viên mới",
      description: "Giảm 10% cho đơn đầu tiên", customerTier: "ALL", discountType: "PERCENT",
      discountValue: "10", maxDiscount: "30000", minOrderValue: "50000", totalStock: 1000, availableStock: 500,
      maxCollect: 1, startDate: new Date(Date.now() - 30 * 86400000).toISOString(), endDate: new Date(Date.now() + 60 * 86400000).toISOString(),
      status: "ACTIVE", createdAt: new Date(Date.now() - 20 * 86400000).toISOString(), collected: true,
    },
    {
      id: 12, voucherStatus: "EXPIRED", availableUsage: 1, voucherCode: "NEWYEAR", voucherName: "Ưu đãi năm mới",
      description: "Giảm 100K cho đơn từ 500K", customerTier: "ALL", discountType: "FIXED",
      discountValue: "100000", maxDiscount: "100000", minOrderValue: "500000", totalStock: 200, availableStock: 0,
      maxCollect: 1, startDate: new Date(Date.now() - 60 * 86400000).toISOString(), endDate: new Date(Date.now() - 30 * 86400000).toISOString(),
      status: "EXPIRED", createdAt: new Date(Date.now() - 55 * 86400000).toISOString(), collected: true,
    },
  ],
  totalElements: 3,
  totalPages: 1,
};

export const MOCK_APPLICABLE_VOUCHERS: PaginatedData<ApplicableVoucher> = {
  data: [
    {
      voucherId: 10, voucherCode: "GOLD50", voucherName: "Ưu đãi Gold 50K", description: "Giảm 50K cho thành viên Gold",
      discountType: "FIXED", discountValue: "50000", maxDiscount: "50000", minOrderValue: "200000",
      availableStock: 45, nameStore: "Tất cả", creatorType: "SYSTEM", applicable: true, reason: null,
    },
    {
      voucherId: 11, voucherCode: "GIAM20", voucherName: "Giảm 20%", description: "Giảm 20% tối đa 50K",
      discountType: "PERCENT", discountValue: "20", maxDiscount: "50000", minOrderValue: "100000",
      availableStock: 320, nameStore: "Tất cả", creatorType: "SYSTEM", applicable: true, reason: null,
    },
  ],
  totalElements: 2,
  totalPages: 1,
};

export function mockResponse<T>(data: T) {
  return {
    status: 200,
    code: "SUCCESS",
    message: "Thành công",
    data,
  };
}

export const MOCK_TRANSACTIONS: PaginatedData<Transaction> = {
  data: [
    {
      id: 1, transactionId: "TXN-1717200000001", customerId: 99, invoiceId: 1,
      voucherId: 10, voucherCode: "GOLD50", originalAmount: 85000, discountAmount: 50000,
      finalAmount: 35000, pointsEarned: 8, status: "SUCCESS",
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 2, transactionId: "TXN-1717200000002", customerId: 99, invoiceId: 2,
      voucherId: null, voucherCode: null, originalAmount: 120000, discountAmount: 0,
      finalAmount: 120000, pointsEarned: 12, status: "SUCCESS",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 3, transactionId: "TXN-1717200000003", customerId: 99, invoiceId: 3,
      voucherId: 11, voucherCode: "GIAM20", originalAmount: 350000, discountAmount: 50000,
      finalAmount: 300000, pointsEarned: 35, status: "SUCCESS",
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 4, transactionId: "TXN-1717200000004", customerId: 99, invoiceId: 4,
      voucherId: null, voucherCode: null, originalAmount: 200000, discountAmount: 0,
      finalAmount: 200000, pointsEarned: 20, status: "SUCCESS",
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: 5, transactionId: "TXN-1717200000005", customerId: 99, invoiceId: 5,
      voucherId: null, voucherCode: null, originalAmount: 150000, discountAmount: 0,
      finalAmount: 150000, pointsEarned: 15, status: "FAILED",
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
  ],
  totalElements: 5,
  totalPages: 1,
};
