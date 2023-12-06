'use client'

import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { ProductColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { ApiList } from '@/components/ui/api-list'

interface ProductClientProps {
  data: ProductColumn[]
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Produtos (${data.length})`}
          description='Gerencie os produtos para sua loja'
        />
        <Button onClick={() => router.push(`/products/new`)}>
          <Plus className='mr-2 h-4 w-4' />
          Adicionar novo
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey='name' />
      <Heading title='API' description='API chamada para os produtos' />
      <Separator />
      <ApiList entityName='products' entityIdName='productId' />
    </>
  )
}
