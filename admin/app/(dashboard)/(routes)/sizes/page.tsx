import { format } from 'date-fns'

import { SizesClient } from './components/client'
import prismadb from '@/lib/prismadb'
import { SizeColumn } from './components/columns'
import ptBR from 'date-fns/locale/pt-BR'

const SizesPage = async () => {
  const sizes = await prismadb.size.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedSizes: SizeColumn[] = sizes.map(item => ({
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
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  )
}

export default SizesPage
