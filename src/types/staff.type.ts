export type StaffPerformance = {
  total: number;
  resolved: number;
  overdue: number;
  inProgress: number;
  avgResolutionHours: number | null;
  onTimeRate: number | null;
  byStatus: Record<string, number>;
};