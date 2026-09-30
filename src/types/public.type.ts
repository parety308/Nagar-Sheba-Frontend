export type PublicStats = {
  totalRequests: number;
  resolvedRequests: number;
  departments: number;
  categories: number;
  averageRating: number | null;
};

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
