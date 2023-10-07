'use client'

import { useStoreModal } from '@/hooks/use-store-modal'
import { Modal } from '@/components/ui/modal'

export const StoreModal = () => {
    const StoreModal = useStoreModal()
    return (
        <Modal
            title='Criar uma loja'
            description='Adicione a nova loja para gerenciar os produtos e categorias'
            isOpen={StoreModal.isOpen}
            onClose={StoreModal.onClose}
        ></Modal>
    )
}
