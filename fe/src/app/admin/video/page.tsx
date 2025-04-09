'use client'
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Textarea,
  useDisclosure,
  useDraggable
} from '@heroui/react'
import { RefObject, useId, useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { BiTrash } from 'react-icons/bi'

type FormValues = {
  file: File | null
  title: string
  description: string
}

const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB

export const VideoPage = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [totalProgress, setTotalProgess] = useState(0)

  const targetRef = useRef<HTMLDivElement>(null)
  const { moveProps } = useDraggable({
    targetRef: targetRef as RefObject<HTMLElement>,
    canOverflow: true,
    isDisabled: !isOpen
  })

  const idUpload = useId()

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors }
  } = useForm<FormValues>({
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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!data.file) return

    setUploading(true)
    setProgress(0)
    const filename = data.file.name
    // Step 1: Init upload
    const initRes = await fetch('http://localhost:5000/api/v1/video/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename })
    })
    const res = await initRes.json()
    const uploadId = res?.result?.uploadId

    const totalParts = Math.ceil(data.file.size / CHUNK_SIZE)
    setTotalProgess(totalParts)

    // Step 2: Upload each chunk
    for (let part = 0; part < totalParts; part++) {
      const start = part * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, data.file.size)
      const blob = data.file.slice(start, end)

      const formData = new FormData()
      formData.append('file', blob)
      formData.append('filename', filename)
      formData.append('uploadId', uploadId)
      formData.append('partNumber', (part + 1).toString())

      setProgress(part + 1)
      try {
        const res = await fetch('http://localhost:5000/api/v1/video/chunk', {
          method: 'POST',
          body: formData
        })

        const data = await res.json()
        console.log('check data:', data)
      } catch (e) {
        console.log('Chunk file err: ', e)
        return
      }
    }

    // stp 3: Complete upload
    const bodyMerge = {
      filename: filename,
      totalChunks: totalParts
    }
    const completeRes = await fetch(
      'http://localhost:5000/api/v1/video/merge',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyMerge)
      }
    )
    const completeResJson = await completeRes.json()
    console.log('Complete: ', completeResJson)
    setUploading(false)
  }

  return (
    <div className='flex items-center justify-center min-h-dvh'>
      <Button onPress={onOpen} className='bg-blue-500 text-white !scale-100'>
        Upload
      </Button>

      <Modal ref={targetRef} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader {...moveProps} className='flex flex-col gap-1'>
                Upload video
              </ModalHeader>
              <ModalBody>
                <form
                  id={idUpload}
                  onSubmit={handleSubmit(onSubmit)}
                  className='flex flex-col gap-4'
                >
                  <Input
                    label='Title'
                    placeholder='Nhập title'
                    labelPlacement='outside'
                    classNames={{
                      inputWrapper:
                        'bg-white hover:!bg-white border rounded-[10px]'
                    }}
                    {...register('title', {
                      required: {
                        value: true,
                        message: 'Vui lòng nhập trường này'
                      }
                    })}
                    errorMessage={errors.title?.message}
                    isInvalid={!!errors.title?.message}
                  />
                  <Textarea
                    label='Mô tả'
                    placeholder='Nhập mô tả video...'
                    labelPlacement='outside'
                    classNames={{
                      inputWrapper:
                        'bg-white hover:!bg-white border rounded-[10px]'
                    }}
                    {...register('description', {
                      required: {
                        value: true,
                        message: 'Vui lòng nhập trường này'
                      }
                    })}
                    errorMessage={errors.description?.message}
                    isInvalid={!!errors.description?.message}
                  />
                  <Controller
                    control={control}
                    name='file'
                    rules={{
                      required: {
                        value: true,
                        message: 'Vui lòng chọn file'
                      }
                    }}
                    render={({ field }) => (
                      <div className='flex flex-col gap-2'>
                        <div
                          className='border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition mb-4'
                          onDrop={onDrop}
                          onDragOver={(e) => e.preventDefault()}
                          onClick={() =>
                            document.getElementById('fileInput')?.click()
                          }
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
                      </div>
                    )}
                  />
                </form>
                {uploading && (
                  <Progress
                    aria-label='Downloading...'
                    className='max-w-md'
                    color='primary'
                    showValueLabel={true}
                    size='sm'
                    value={progress}
                    maxValue={totalProgress}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button color='primary' type='submit' form={idUpload}>
                  Upload Video
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default VideoPage
