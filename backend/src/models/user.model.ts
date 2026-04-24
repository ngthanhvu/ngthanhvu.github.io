export interface User {
  id: number;
  email: string;
  fullName: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  fullName: string;
  passwordHash: string;
}
