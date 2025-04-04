'use client'

import { useProgressStore } from '@/zustand/upload_store'
import { Button, Input } from '@heroui/react'
import Link from 'next/link'
import { useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type IFormUpload = {
  username: string
}

const UploadTest = () => {
  const { register, handleSubmit } = useForm<IFormUpload>()
  const { update, setWorker } = useProgressStore()

  const onSubmit: SubmitHandler<IFormUpload> = (data) => {
    const worker = new Worker(new URL('./worker.ts', import.meta.url))
    setWorker(worker)

    worker.postMessage('')
    worker.onmessage = (event) => {
      const { status, data, error } = event.data

      if (status === 'progress') {
        update(data)
      } else if (status === 'success') {
        worker.terminate()
        setWorker(null)
      } else {
        console.error('Upload failed:')
        worker.terminate()
        setWorker(null)
      }
    }
  }

  return (
    <div className='flex min-h-dvh justify-center items-center'>
      <form className='w-[480px]' onSubmit={handleSubmit(onSubmit)}>
        <Input
          label='username'
          labelPlacement='outside'
          placeholder='Nhập username'
          {...register('username')}
        />
        <Button type='submit' className='mt-4'>
          Submit
        </Button>
        <Link href={'/file'} className='block mt-2 border w-fit p-2 rounded-xl'>Quản lý file</Link>
      </form>
    </div>
  )
}

export default UploadTest
