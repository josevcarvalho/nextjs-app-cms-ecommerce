import qs from 'query-string'

import { Product } from '@/types'

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`

interface Query {
  categoryId?: string
  colorId?: string
  sizeId?: string
  isFeatured?: boolean
}

const getProducts = async ({
  categoryId,
  colorId,
  isFeatured,
  sizeId,
}: Query): Promise<Product[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      colorId,
      categoryId,
      isFeatured,
      sizeId,
    },
  })
  const res = await fetch(url)

  return res.json()
}

export default getProducts
