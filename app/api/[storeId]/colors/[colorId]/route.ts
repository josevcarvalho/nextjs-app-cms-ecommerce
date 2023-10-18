import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { colorId: string } }
) {
    try {
        if (!params.colorId)
            return new NextResponse('É necessário uma cor', { status: 400 })

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,
            },
        })

        return NextResponse.json(color)
    } catch (error) {
        console.log('[COLOR_GET]', error)
        return new NextResponse('Erro interno', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; colorId: string } }
) {
    try {
        const { userId } = auth()
        const body = await req.json()

        const { name, value } = body

        if (!userId)
            return new NextResponse('Requer autenticação', { status: 401 })

        if (!name)
            return new NextResponse('Informe o nome da cor', {
                status: 400,
            })

        if (!value)
            return new NextResponse('Informe o valor da cor', {
                status: 400,
            })

        if (!params.storeId)
            return new NextResponse('É necessário uma loja', { status: 400 })

        if (!params.colorId)
            return new NextResponse('É necessário um painel', { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.storeId, userId },
        })

        if (!storeByUserId) {
            return new NextResponse('Não autorizado', { status: 403 })
        }

        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value,
            },
        })

        return NextResponse.json(color)
    } catch (error) {
        console.log('[COLOR_PATCH]', error)
        return new NextResponse('Erro interno', { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; colorId: string } }
) {
    try {
        const { userId } = auth()

        if (!userId)
            return new NextResponse('Requer autenticação', { status: 401 })

        if (!params.storeId)
            return new NextResponse('É necessário uma loja', { status: 400 })

        if (!params.colorId)
            return new NextResponse('É necessário uma cor', { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.storeId, userId },
        })

        if (!storeByUserId) {
            return new NextResponse('Não autorizado', { status: 403 })
        }

        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,
            },
        })

        return NextResponse.json(color)
    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error)
        return new NextResponse('Erro interno', { status: 500 })
    }
}
