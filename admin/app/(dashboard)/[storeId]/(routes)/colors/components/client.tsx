'use client'

import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import {
    ColorColumn,
    columns,
} from '@/app/(dashboard)/[storeId]/(routes)/colors/components/columns'
import { DataTable } from '@/components/ui/data-table'
import { ApiList } from '@/components/ui/api-list'

interface ColorsClientProps {
    data: ColorColumn[]
}

export const ColorsClient: React.FC<ColorsClientProps> = ({ data }) => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading
                    title={`Cores (${data.length})`}
                    description='Gerencie as cores dos produtos da sua loja'
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/colors/new`)}
                >
                    <Plus className='mr-2 h-4 w-4' />
                    Adicionar novo
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey='name' />
            <Heading title='API' description='API chamada para as cores' />
            <Separator />
            <ApiList entityName='colors' entityIdName='colorId' />
        </>
    )
}
