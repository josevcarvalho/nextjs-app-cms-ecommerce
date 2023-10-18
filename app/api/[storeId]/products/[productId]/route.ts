import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        if (!params.productId)
            return new NextResponse('É necessário um produto', { status: 400 })

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
            },
        })

        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCT_GET]', error)
        return new NextResponse('Erro interno', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; productId: string } }
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

        if (!params.productId)
            return new NextResponse('É necessário um produto', { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.storeId, userId },
        })

        if (!storeByUserId) {
            return new NextResponse('Não autorizado', { status: 403 })
        }

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                isArchived,
                isFeatured,
                sizeId,
                images: {
                    deleteMany: {},
                },
            },
        })

        const product = await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
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
        console.log('[PRODUCT_PATCH]', error)
        return new NextResponse('Erro interno', { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; productId: string } }
) {
    try {
        const { userId } = auth()

        if (!userId)
            return new NextResponse('Requer autenticação', { status: 401 })

        if (!params.storeId)
            return new NextResponse('É necessário uma loja', { status: 400 })

        if (!params.productId)
            return new NextResponse('É necessário um produto', { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.storeId, userId },
        })

        if (!storeByUserId) {
            return new NextResponse('Não autorizado', { status: 403 })
        }

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            },
        })

        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error)
        return new NextResponse('Erro interno', { status: 500 })
    }
}
