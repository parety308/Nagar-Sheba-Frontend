export type Department = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  deletedAt: string | null;
};

export type CreateDepartmentPayload = { name: string; description?: string };
export type UpdateDepartmentPayload = Partial<CreateDepartmentPayload>;