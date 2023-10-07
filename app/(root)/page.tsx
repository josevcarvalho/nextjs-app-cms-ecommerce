'use client'

import { Modal } from '@/components/ui/modal'

const SetupPage = () => (
    <div className='p-4'>
        <Modal title='Teste' description='descricao' isOpen onClose={() => {}}>
            Teste
        </Modal>
    </div>
)

export default SetupPage
