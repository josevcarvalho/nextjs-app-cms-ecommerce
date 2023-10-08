'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

import { useStoreModal } from '@/hooks/use-store-modal'
import { Modal } from '@/components/ui/modal'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormItem,
    FormLabel,
    FormField,
    FormControl,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
    name: z.string().min(1),
})

export const StoreModal = () => {
    const StoreModal = useStoreModal()

    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true)

            const response = await axios.post('/api/stores', values)

            toast.success('Loja criada')
        } catch (error) {
            toast.error('Deu alguma coisa errada')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            title='Criar uma loja'
            description='Adicione a nova loja para gerenciar os produtos e categorias'
            isOpen={StoreModal.isOpen}
            onClose={StoreModal.onClose}
        >
            <div>
                <div className='space-y-4 py-2 pb-4'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder='E-commerce'
                                                {...field}
                                            ></Input>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                                <Button
                                    variant='outline'
                                    onClick={StoreModal.onClose}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button disabled={loading} type='submit'>
                                    Continuar
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}
