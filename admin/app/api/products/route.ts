import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth()

        const {
            name,
            price,
            images,
            isFeatured,
            isArchived,
            categoryId,
            sizeId,
            colorId,
        } = await req.json()

        if (!userId) {
            return new NextResponse('Requer autenticação', { status: 401 })
        }

        if (!name) {
            return new NextResponse('Informe o nome do produto', {
                status: 400,
            })
        }

        if (!images || !images.length) {
            return new NextResponse(
                'Importe no minimo uma imagem para o produto',
                {
                    status: 400,
                }
            )
        }

        if (!price) {
            return new NextResponse('Informe o preço do produto', {
                status: 400,
            })
        }

        if (!categoryId) {
            return new NextResponse('Informe a categoria do produto', {
                status: 400,
            })
        }

        if (!sizeId) {
            return new NextResponse('Informe o tamanho do produto', {
                status: 400,
            })
        }

        if (!colorId) {
            return new NextResponse('Informe a cor do produto', {
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

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                isArchived,
                isFeatured,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image),
                        ],
                    },
                },
            },
        })

        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCTS_POST]', error)
        return new NextResponse('Erro interno', { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get('categoryId') || undefined
        const colorId = searchParams.get('colorId') || undefined
        const sizeId = searchParams.get('sizeId') || undefined
        const isFeatured = searchParams.get('isFeatured')

        if (!params.storeId) {
            return new NextResponse('É necessário uma loja', {
                status: 400,
            })
        }

        const product = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                category: true,
                color: true,
                size: true,
                store: true,
                images: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCTS_GET]', error)
        return new NextResponse('Erro interno', { status: 500 })
    }
}
