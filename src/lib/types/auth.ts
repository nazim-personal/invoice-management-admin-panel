// types/auth.ts

import { ApiResponse } from "./api";
import { UserDataTypes } from "./users";

export interface SignInDataTypes {
  access_token: string;
  user_info: UserDataTypes;
}

export type SignInApiResponseTypes = ApiResponse<SignInDataTypes>;
