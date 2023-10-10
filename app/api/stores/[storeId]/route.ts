import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth()
        const { name } = await req.json()

        if (!userId) return new NextResponse('Não autorizado', { status: 401 })

        if (!name) return new NextResponse('Informe um nome', { status: 400 })

        if (!params.storeId)
            return new NextResponse('É necessário uma loja', { status: 400 })

        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId,
            },
            data: {
                name,
            },
        })

        return NextResponse.json(store)
    } catch (error) {
        console.log('[STORES_PATCH]', error)
        return new NextResponse('Erro interno', { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse('Não autorizado', { status: 401 })

        if (!params.storeId)
            return new NextResponse('É necessário uma loja', { status: 400 })

        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId,
            },
        })

        return NextResponse.json(store)
    } catch (error) {
        console.log('[STORES_DELETE]', error)
        return new NextResponse('Erro interno', { status: 500 })
    }
}
