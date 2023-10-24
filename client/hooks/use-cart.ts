import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { Product } from '@/types'
import { toast } from 'react-hot-toast'

interface CartStore {
  items: Product[]
  addItem: (data: Product) => void
  removeItem: (id: string) => void
  removeAll: () => void
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product) => {
        const currentItems = get().items
        const existingItem = currentItems.find(item => item.id === data.id)

        if (existingItem) return toast('Produto já está no carrinho')

        set({ items: [...get().items, data] })
        toast.success('Produto adicionado no carrinho')
      },
      removeItem: (id: string) => {
        set({ items: [...get().items.filter(item => item.id !== id)] })
        toast.success('Item removido do carrinho')
      },
      removeAll: () => {
        set({ items: [] })
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useCart
