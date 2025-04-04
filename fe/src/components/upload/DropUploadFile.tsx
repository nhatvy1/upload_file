'use client'
import React, { useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { BiTrash } from 'react-icons/bi'

type FormValues = {
  file: File | null
}

const FileUploadForm = ()=> {
  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: { file: null }
  })


  const selectedFile = watch('file')

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      setValue('file', file, { shouldValidate: true })
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('file', file, { shouldValidate: true })
    }
  }

  const removeFile = () => {
    setValue('file', null, { shouldValidate: true })
  }

  const onSubmit = (data: FormValues) => {
    console.log('Submitted file:', data.file)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='max-w-md mx-auto p-4'>
      <Controller
        control={control}
        name='file'
        render={({ field }) => (
          <>
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              className='border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition mb-4'
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <p className='text-gray-500'>
                Kéo và thả file vào đây hoặc nhấn để chọn
              </p>
              <input
                id='fileInput'
                type='file'
                onChange={onFileChange}
                className='hidden'
              />
            </div>

            {selectedFile && (
              <div className='flex items-center justify-between bg-gray-100 p-3 rounded-lg'>
                <span className='text-sm text-gray-800'>
                  {selectedFile.name}
                </span>
                <button
                  type='button'
                  onClick={removeFile}
                  className='text-red-500 hover:text-red-700 transition'
                >
                  <BiTrash size={18} />
                </button>
              </div>
            )}
          </>
        )}
      />

      <button
        type='submit'
        className='mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition'
      >
        Gửi file
      </button>
    </form>
  )
}

export default FileUploadForm