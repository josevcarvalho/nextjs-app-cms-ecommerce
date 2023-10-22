'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from '@/app/(dashboard)/[storeId]/(routes)/categories/components/cell-action'

export type CategoryColumn = {
    id: string
    name: string
    billboardLabel: string
    createdAt: string
}

export const columns: ColumnDef<CategoryColumn>[] = [
    {
        accessorKey: 'name',
        header: 'Nome',
    },
    {
        accessorKey: 'billboard',
        header: 'Painel',
        cell: ({ row }) => row.original.billboardLabel,
    },
    {
        accessorKey: 'createdAt',
        header: 'Criação',
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />,
    },
]
