// hooks/useUploadManager.ts
import { useUploadStore } from '@/zustand/upload_store'
import { useEffect, useRef } from 'react'

export function useUploadManager() {
  const workerRef = useRef<Worker | null>(null)
  const {
    startUpload: startStoreUpload,
    cancelUpload,
    setProgress,
    setError,
    completeUpload
  } = useUploadStore()

  useEffect(() => {
    const worker = new Worker(
      new URL('../public/upload.worker.ts', import.meta.url),
      {
        type: 'module'
      }
    )
    workerRef.current = worker

    worker.onmessage = (
      e: MessageEvent<{ type: string; progress?: number; error?: string }>
    ) => {
      switch (e.data.type) {
        case 'PROGRESS_UPDATE':
          setProgress(e.data.progress!)
          break
        case 'UPLOAD_STARTED':
          startStoreUpload() // Now called without parameters
          break
        case 'UPLOAD_COMPLETE':
          completeUpload()
          break
        case 'UPLOAD_ERROR':
          setError(e.data.error!)
          break
      }
    }

    return () => {
      worker.terminate()
    }
  }, [completeUpload, setError, setProgress, startStoreUpload])

  const startUpload = (files: File[]) => {
    workerRef.current?.postMessage({
      type: 'START_UPLOAD',
      payload: { files }
    })
  }

  const cancelCurrentUpload = () => {
    workerRef.current?.postMessage({ type: 'CANCEL_UPLOAD' })
    cancelUpload()
  }

  return { startUpload, cancelUpload: cancelCurrentUpload }
}
