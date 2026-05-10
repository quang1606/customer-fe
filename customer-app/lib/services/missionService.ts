import api from "../api/axios";
import { ENDPOINTS } from "../endpoints";
import { ApiResponse, MissionsResponse, MissionClaimResult } from "../types";

export const missionService = {
  getAll: (page = 0, size = 20) =>
    api.get<ApiResponse<MissionsResponse>>(ENDPOINTS.MISSIONS.LIST, {
      params: { page, size },
    }),

  claimReward: (missionId: number) =>
    api.post<ApiResponse<MissionClaimResult>>(ENDPOINTS.MISSIONS.CLAIM, { missionId }),
};
