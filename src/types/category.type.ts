export type FeeType = "FREE" | "PAID";

export type Category = {
  id: string;
  name: string;
  feeType: FeeType;
  feeAmount?: string;
  slaHours: number;
  departmentId?: string;
};

export type CreateCategoryPayload = {
  departmentId: string;
  name: string;
  feeType: FeeType;
  feeAmount?: number;
  slaHours: number;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload> & {
  isActive?: boolean;
};
