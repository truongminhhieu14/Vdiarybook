export type ILogin = {
    email: string,
    password: string
}

export type IRegister = {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}

export type IRefreshToken = {
    accessToken: string
}

export type IProfile = {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    background?: string;
    verified?: boolean;
    role: "admin" | "user";
    createdAt: Date;
    updatedAt: Date;
}

export type IUpdateProfile = {
    name?: string;
    avatar?: string;
    background?: string;
}

export type User = {
  _id: string
  name: string
  email: string
  avatar: string
  background: string
  verified: boolean
}
export type UsersResponse = {
  users: User[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};
