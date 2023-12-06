import prismadb from '@/lib/prismadb'

export const getStockCount = async () => {
  const stockCount = await prismadb.product.count({
    where: {
      isArchived: false,
    },
  })

  return stockCount
}
