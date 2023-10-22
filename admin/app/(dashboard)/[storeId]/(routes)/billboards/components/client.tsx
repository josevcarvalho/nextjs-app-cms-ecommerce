'use client'

import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import {
    BillboardColumn,
    columns,
} from '@/app/(dashboard)/[storeId]/(routes)/billboards/components/columns'
import { DataTable } from '@/components/ui/data-table'
import { ApiList } from '@/components/ui/api-list'

interface BillboardClientProps {
    data: BillboardColumn[]
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading
                    title={`Paineis (${data.length})`}
                    description='Gerencie o painel para sua loja'
                />
                <Button
                    onClick={() =>
                        router.push(`/${params.storeId}/billboards/new`)
                    }
                >
                    <Plus className='mr-2 h-4 w-4' />
                    Adicionar novo
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey='label' />
            <Heading title='API' description='API chamada para os paineis' />
            <Separator />
            <ApiList entityName='billboards' entityIdName='billboardId' />
        </>
    )
}
