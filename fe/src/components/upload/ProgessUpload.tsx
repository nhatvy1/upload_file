'use client'

import { useProgressStore } from '@/zustand/upload_store'
import { Button, CircularProgress } from '@heroui/react'
import { FaChevronUp } from 'react-icons/fa'
import { MdClose, MdMovieCreation } from 'react-icons/md'

const ProgressUpload = () => {
  const { status, progress, message, cancel } = useProgressStore()

  return (
    <div className='fixed border-x border-t shadow-md rounded-t-2xl bottom-0 p-3 right-4 transition-all duration-300 ease-in-out w-96'>
      <div className='flex justify-between items-center'>
        <div>Đang tải lên 1 thư mục</div>
        <div className='flex items-center gap-2'>
          <Button isIconOnly className='bg-white'>
            <FaChevronUp />
          </Button>
          <Button isIconOnly className='bg-white' onPress={cancel}>
            <MdClose />
          </Button>
        </div>
      </div>

      <div className='mt-1 flex items-center'>
        <div className='flex-1 flex items-center gap-2'>
          <MdMovieCreation className='text-red-500' />
          <p className='flex-1'>file_416mb.mov</p>
        </div>
        <div className=''>
          <CircularProgress
            aria-label='Loading...'
            color='success'
            showValueLabel={true}
            size='sm'
            value={progress}
          />
        </div>
      </div>
    </div>
  )
}

export default ProgressUpload
