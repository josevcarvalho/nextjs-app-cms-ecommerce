import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth()

        const { label, imageUrl } = await req.json()

        if (!userId) {
            return new NextResponse('Requer autenticação', { status: 401 })
        }

        if (!label) {
            return new NextResponse('Informe o conteúdo do painel', {
                status: 400,
            })
        }

        if (!imageUrl) {
            return new NextResponse(
                'Importe uma imagem de fundo para o painel',
                {
                    status: 400,
                }
            )
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

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId,
            },
        })

        return NextResponse.json(billboard)
    } catch (error) {
        console.log('[BILLBOARDS_POST]', error)
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

        const billboard = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId,
            },
        })

        return NextResponse.json(billboard)
    } catch (error) {
        console.log('[BILLBOARDS_GET]', error)
        return new NextResponse('Erro interno', { status: 500 })
    }
}
