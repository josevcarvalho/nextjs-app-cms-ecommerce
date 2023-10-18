'use client'

import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import {
    SizeColumn,
    columns,
} from '@/app/(dashboard)/[storeId]/(routes)/sizes/components/columns'
import { DataTable } from '@/components/ui/data-table'
import { ApiList } from '@/components/ui/api-list'

interface SizesClientProps {
    data: SizeColumn[]
}

export const SizesClient: React.FC<SizesClientProps> = ({ data }) => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading
                    title={`Tamanhos (${data.length})`}
                    description='Gerencie os tamanhos dos produtos da sua loja'
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/sizes/new`)}
                >
                    <Plus className='mr-2 h-4 w-4' />
                    Adicionar novo
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey='name' />
            <Heading title='API' description='API chamada para os tamanhos' />
            <Separator />
            <ApiList entityName='sizes' entityIdName='sizeId' />
        </>
    )
}
