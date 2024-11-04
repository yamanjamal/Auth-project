import { Role } from '@prisma/client';

export interface ActiveUserDate {
  sub: number;
  email: string;
  role: Role & {
    permissions: {
      name: string;
      id: number;
      roleId: number;
    }[];
  };
}
