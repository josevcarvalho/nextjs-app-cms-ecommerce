'use client'

import { Dialog } from '@headlessui/react'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'

import Button from '@/components/ui/button'
import IconButton from '@/components/ui/icon-button'
import { Color, Size } from '@/types'
import Filter from './filter'

interface MobileFiltersProps {
  sizes: Size[]
  colors: Color[]
}

const MobileFilters: React.FC<MobileFiltersProps> = ({ colors, sizes }) => {
  const [open, setOpen] = useState(false)

  const onOpen = () => setOpen(true)
  const onClose = () => setOpen(false)

  return (
    <>
      <Button className='flex items-center gap-x-2 lg:hidden' onClick={onOpen}>
        Filtros
        <Plus size={20} />
      </Button>
      <Dialog
        open={open}
        as='div'
        className='relative z-40 lg:hidden'
        onClose={onClose}
      >
        {/* background */}
        <div className='fixed inset-0 bg-black bg-opacity-25' />
        {/* dialog */}
        <div className='fixed inset-0 z-40 flex'>
          <Dialog.Panel
            className={`
              relative 
              ml-auto 
              flex 
              h-full 
              w-full 
              max-w-xs 
              flex-col 
              overflow-y-auto 
              bg-white 
              py-4 
              pb-6 
              shadow-xl`}
          >
            {/* Close button */}
            <div className='flex items-center justify-end px-4'>
              <IconButton icon={<X size={15} />} onClick={onClose} />
            </div>

            {/* Render the filters */}
            <div className='p-4'>
              <Filter valueKey='sizeId' name='Tamanhos' data={sizes} />
              <Filter valueKey='colorId' name='Cores' data={colors} />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

export default MobileFilters
