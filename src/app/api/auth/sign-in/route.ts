import { API_AUTH_SIGN_IN } from "@/constants/apis";
import { encryptToken } from "@/lib/crypto";
import API from "@/lib/helpers/axios/API";
import { axiosErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { SignInApiResponseTypes } from "@/lib/types/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const response = await API.post<SignInApiResponseTypes>(API_AUTH_SIGN_IN, body);
        const apiResponse = response.data;        
        const res = NextResponse.json({
            success: apiResponse.success,
            message: apiResponse.message,
            user_info: apiResponse.data.results.user_info,
        });
        const encrypted_access_token = encryptToken(apiResponse.data.results.access_token);
        res.cookies.set({
            name: "access_token",
            value: encrypted_access_token,
            httpOnly: true,   // more secure
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return res;
    } catch (err: any) {
        return axiosErrorResponse(err)
    }
}
