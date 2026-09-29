export type Department = {
  id: string;
  name: string;
  description?: string;
};

export type CreateDepartmentPayload = {
  name: string;
  description?: string;
};

export type UpdateDepartmentPayload = Partial<CreateDepartmentPayload>;
