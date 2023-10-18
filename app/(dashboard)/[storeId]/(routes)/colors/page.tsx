import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { ColorsClient } from '@/app/(dashboard)/[storeId]/(routes)/colors/components/client'
import prismadb from '@/lib/prismadb'
import { ColorColumn } from '@/app/(dashboard)/[storeId]/(routes)/colors/components/columns'

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    const formattedColors: ColorColumn[] = colors.map(item => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "dd 'de' MMMM 'de' yyyy", {
            locale: ptBR,
        }),
    }))

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ColorsClient data={formattedColors} />
            </div>
        </div>
    )
}

export default ColorsPage
