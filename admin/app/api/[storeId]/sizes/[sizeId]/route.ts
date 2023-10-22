import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { sizeId: string } }
) {
    try {
        if (!params.sizeId)
            return new NextResponse('É necessário um tamanho', { status: 400 })

        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            },
        })

        return NextResponse.json(size)
    } catch (error) {
        console.log('[SIZE_GET]', error)
        return new NextResponse('Erro interno', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; sizeId: string } }
) {
    try {
        const { userId } = auth()
        const body = await req.json()

        const { name, value } = body

        if (!userId)
            return new NextResponse('Requer autenticação', { status: 401 })

        if (!name)
            return new NextResponse('Informe a descrição do tamanho', {
                status: 400,
            })

        if (!value)
            return new NextResponse('Informe o valor do tamanho', {
                status: 400,
            })

        if (!params.storeId)
            return new NextResponse('É necessário uma loja', { status: 400 })

        if (!params.sizeId)
            return new NextResponse('É necessário um painel', { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.storeId, userId },
        })

        if (!storeByUserId) {
            return new NextResponse('Não autorizado', { status: 403 })
        }

        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value,
            },
        })

        return NextResponse.json(size)
    } catch (error) {
        console.log('[SIZE_PATCH]', error)
        return new NextResponse('Erro interno', { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; sizeId: string } }
) {
    try {
        const { userId } = auth()

        if (!userId)
            return new NextResponse('Requer autenticação', { status: 401 })

        if (!params.storeId)
            return new NextResponse('É necessário uma loja', { status: 400 })

        if (!params.sizeId)
            return new NextResponse('É necessário um tamanho', { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.storeId, userId },
        })

        if (!storeByUserId) {
            return new NextResponse('Não autorizado', { status: 403 })
        }

        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId,
            },
        })

        return NextResponse.json(size)
    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error)
        return new NextResponse('Erro interno', { status: 500 })
    }
}
