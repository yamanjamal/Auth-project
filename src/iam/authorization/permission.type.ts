import { UsersPermissions } from 'src/users/user.permissions';

export const Permission = {
  ...UsersPermissions,
};

export type PermissionType = UsersPermissions; //  | ...other permissions enums
