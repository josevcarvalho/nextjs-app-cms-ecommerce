'use client'

import axios from 'axios'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

import { SizeColumn } from '@/app/(dashboard)/[storeId]/(routes)/sizes/components/columns'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AlertModal } from '@/components/modals/alert-modal'

interface CellActionProps {
    data: SizeColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const router = useRouter()
    const params = useParams()

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success('ID do tamanho copiado para a área de transferência.')
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/sizes/${data.id}`)
            router.refresh()
            router.push(`/${params.storeId}/sizes`)
            toast.success('Tamanho deletado')
        } catch (error) {
            toast.error(
                'Certifique-se de remover todos os produtos usando esse tamanho primeiro. '
            )
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Abrir menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className='mr-2 h-4 w-4' />
                        Copiar ID
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() =>
                            router.push(`/${params.storeId}/sizes/${data.id}`)
                        }
                    >
                        <Edit className='mr-2 h-4 w-4' />
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className='mr-2 h-4 w-4' />
                        Deletar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
