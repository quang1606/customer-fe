import api from "../api/axios";
import { ENDPOINTS } from "../endpoints";
import { ApiResponse, LeaderboardResponse } from "../types";

export const leaderboardService = {
  get: () => api.get<ApiResponse<LeaderboardResponse>>(ENDPOINTS.LEADERBOARD),
};
