export type Feedback = {
  id: string;
  requestId: string;
  citizenId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  request?: { id: string; trackingRef: string; title: string; departmentId: string };
};