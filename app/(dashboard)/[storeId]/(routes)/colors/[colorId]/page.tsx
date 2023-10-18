import prismadb from '@/lib/prismadb'
import { ColorForm } from '@/app/(dashboard)/[storeId]/(routes)/colors/[colorId]/components/color-form'

const BillboardPage = async ({ params }: { params: { colorId: string } }) => {
    const color = await prismadb.color.findUnique({
        where: {
            id: params.colorId,
        },
    })
    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ColorForm initialData={color} />
            </div>
        </div>
    )
}

export default BillboardPage
