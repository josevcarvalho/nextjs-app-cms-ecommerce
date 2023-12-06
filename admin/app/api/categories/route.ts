import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth()

        const { name, billboardId } = await req.json()

        if (!userId) {
            return new NextResponse('Requer autenticação', { status: 401 })
        }

        if (!name) {
            return new NextResponse('Informe o nome da caterogia', {
                status: 400,
            })
        }

        if (!billboardId) {
            return new NextResponse('Informe um painel', {
                status: 400,
            })
        }

        if (!params.storeId) {
            return new NextResponse('É necessário uma loja', {
                status: 400,
            })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.storeId, userId },
        })

        if (!storeByUserId) {
            return new NextResponse('Não autorizado', { status: 403 })
        }

        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId,
            },
        })

        return NextResponse.json(category)
    } catch (error) {
        console.log('[CATEGORIES_POST]', error)
        return new NextResponse('Erro interno', { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) {
            return new NextResponse('É necessário uma loja', {
                status: 400,
            })
        }

        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId,
            },
        })

        return NextResponse.json(categories)
    } catch (error) {
        console.log('[CATEGORIES_GET]', error)
        return new NextResponse('Erro interno', { status: 500 })
    }
}
