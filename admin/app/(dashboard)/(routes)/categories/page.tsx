import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import prismadb from '@/lib/prismadb'
import { CategoryClient } from './components/client'
import { CategoryColumn } from './components/columns'

const CategoriesPage = async () => {
  const categories = await prismadb.category.findMany({
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedCategories: CategoryColumn[] = categories.map(item => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    }),
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  )
}

export default CategoriesPage
