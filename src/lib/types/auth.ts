// types/auth.ts

import { ApiResponse } from "./api";
import { UserDataTypes } from "./users";

export interface SignInDataTypes {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserDataTypes;
}

export type SignInApiResponseTypes = ApiResponse<SignInDataTypes>;
