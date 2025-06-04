import { NextRequest, NextResponse } from "next/server";
import { checkJwt, getUserNotFound, prisma, setBcrypt } from "../../general";

// buat service "DELETE" (parameter = id) tb_user
export const DELETE = async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
    // panggil fungsi cek token "checkJwt"
    if (checkJwt(request)) {
        return checkJwt(request)
    }

    const params = await props.params;

    // cek apakah id ada / tidak
    const check = await prisma.tb_user.findUnique({
        where: {
            id: Number(params.id),
        }
    })

    // jika data "username" ditemukan
    if (!check) {
        return NextResponse.json({
            meta_data: {
                error: 1,
                message: `${process.env.USER_FAILED_DELETE_MESSAGE} ${process.env.USER_NOT_EXIST_MESSAGE}`,
                status: 404
            },
        }, {
            status: 200
        })
    }

    // proses delete data
    await prisma.tb_user.delete({
        where: {
            id: Number(params.id),
        }
    })

    // proses / response API
    return NextResponse.json({
        meta_data: {
            error: 0,
            message: process.env.USER_SUCCESS_DELETE_MESSAGE,
            status: 200
        },
    }, {
        status: 200
    })
}

// buat service "GET" (detail data) tb_user
export const GET = async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
    // panggil fungsi cek token "checkJwt"
    if (checkJwt(request)) {
        return checkJwt(request)
    }

    try {

        const params = await props.params;

        // cek apakah id ada / tidak
        const check = await prisma.tb_user.findUnique({
            where: {
                id: Number(params.id),
            }
        })

        // jika data user tidak ditemukan
        if (!check) {
            // panggil fungsi "getUserNotFound"
            return getUserNotFound()

        }

        // proses / response API
        return NextResponse.json({
            meta_data: {
                error: 0,
                message: null,
                status: 200
            },
            data_user: check
        }, {
            status: 200
        })

    }
    catch (e: any) {
        return NextResponse.json({
            meta_data: {
                error: 1,
                message: process.env.USER_FAILED_SLUG_MESSAGE,
                status: 400
            },
        }, {
            status: 200
        })
    }

}

// buat service "PUT" (edit data) tb_user
export const PUT = async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
    // panggil fungsi cek token "checkJwt"
    if (checkJwt(request)) {
        return checkJwt(request)
    }
    
    const params = await props.params;

    // cek apakah id ada / tidak
    const check = await prisma.tb_user.findUnique({
        where: {
            id: Number(params.id),
        }
    })

    // jika data user tidak ditemukan
    if (!check) {
        // panggil fungsi "getUserNotFound"
        return getUserNotFound()
    }

    // buat object untuk data isian
    const { nama_value, username_value, password_value } = await request.json()

    // cek apakah username sudah pernah ada / belum
    const checkUsername = await prisma.tb_user.findMany({
        where: {
            username: username_value,
            // id: {not: Number(params.id)}
            NOT: { id: Number(params.id) }
        }
    })

    // jika data "username" ditemukan
    if (checkUsername.length >= 1) {
        return NextResponse.json({
            meta_data: {
                error: 1,
                message: `${process.env.USER_FAILED_UPDATE_MESSAGE} ${process.env.USER_EXIST_MESSAGE}`,
                status: 409
            },
        }, {
            status: 200
        })
    }

    // jika password diubah
    if (password_value != process.env.PASSWORD_TEXT) {
        await prisma.tb_user.update({

            where: {
                id: Number(params.id),
            },
            data: {
                nama: nama_value,
                username: username_value,
                password: setBcrypt(password_value)
            },
        })
    }
    // jika password tidak diubah
    else {
        await prisma.tb_user.update({

            where: {
                id: Number(params.id),
            },
            data: {
                nama: nama_value,
                username: username_value
            },
        })
    }


    // proses / response API
    return NextResponse.json({
        meta_data: {
            error: 0,
            message: process.env.USER_SUCCESS_UPDATE_MESSAGE,
            status: 200
        },
    }, {
        status: 200
    })
}