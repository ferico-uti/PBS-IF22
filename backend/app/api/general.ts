import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { jwtVerify } from "@/lib/jwt";

export const prisma = new PrismaClient

export const getUserNotFound = () => {

    return NextResponse.json({
        meta_data: {
            error: 1,
            message: process.env.USER_NOT_FOUND_MESSAGE,
            status: 404
        },
    }, {
        status: 200
    })

}

// buat fungsi bcrypt
export const setBcrypt = (real_password: string) => {
    // buat bcrypt
    const salt_password = genSaltSync(10);
    const hash_password = hashSync(real_password, salt_password);

    return hash_password

}

// buat fungsi cek token jwt
export const checkJwt = (request: NextRequest) => {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        return NextResponse.json({
            meta_data: {
                error: 1,
                token: process.env.TOKEN_NOT_FOUND_MESSAGE,
                status: 401
            },
        }, {
            status: 200
        })
    }

    const verify = jwtVerify(token);
    if (!verify) {
        return NextResponse.json({
            meta_data: {
                error: 1,
                token: process.env.TOKEN_INVALID_MESSAGE,
                status: 401
            },
        }, {
            status: 200
        })
    }    
}
