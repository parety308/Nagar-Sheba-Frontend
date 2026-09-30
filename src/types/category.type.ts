export type FeeType = "FREE" | "PAID";

export type Category = {
  id: string;
  name: string;
  feeType: FeeType;
  feeAmount: string | null;
  slaHours: number;
  isActive: boolean;
  departmentId: string;
  createdAt: string;
  department?: { id: string; name: string };
};

export type CreateCategoryPayload = {
  departmentId: string;
  name: string;
  feeType: FeeType;
  feeAmount?: number;
  slaHours: number;
};

export type UpdateCategoryPayload = Partial<
  Omit<CreateCategoryPayload, "departmentId">
> & {
  isActive?: boolean;
};
