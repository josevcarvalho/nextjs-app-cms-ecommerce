'use client'

import * as z from 'zod'
import { useState } from 'react'
import { Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { Size } from '@prisma/client'
import { zodResolver } from '@hookform/resolvers/zod'

import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/alert-modal'

interface SizeFormProps {
    initialData: Size | null
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
})

type SizeFormValues = z.infer<typeof formSchema>

export const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? 'Editar tamanho' : 'Criar tamanho'
    const description = initialData
        ? 'Editar um tamanho'
        : 'Criar um novo tamanho'
    const toastMessage = initialData ? 'Tamanho atualizado' : 'Tamanho criado'
    const action = initialData ? 'Salvar alterações' : 'Criar'

    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: '',
        },
    })

    const onSubmit = async (data: SizeFormValues) => {
        try {
            setLoading(true)
            if (initialData)
                await axios.patch(
                    `/api/${params.storeId}/sizes/${params.sizeId}`,
                    data
                )
            else await axios.post(`/api/${params.storeId}/sizes`, data)
            router.refresh()
            router.push(`/${params.storeId}/sizes`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error('Deu alguma coisa errada')
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
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
            <div className='flex items-center justify-between'>
                <Heading title={title} description={description} />
                {initialData && (
                    <Button
                        variant='destructive'
                        size='icon'
                        onClick={() => setOpen(true)}
                        disabled={loading}
                    >
                        <Trash className='h-4 w-4' />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8 w-full'
                >
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder='Descrição do tamanho'
                                            {...field}
                                        ></Input>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='value'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valor</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder='Valor do tamanho'
                                            {...field}
                                        ></Input>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        disabled={loading}
                        className='ml-auto'
                        type='submit'
                    >
                        {action}
                    </Button>
                </form>
            </Form>
            <Separator />
        </>
    )
}
