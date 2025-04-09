
const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB chunks
const totalChunks = Math.ceil(data.file.size / CHUNK_SIZE)

let uploadedChunks = 0

for (let start = 0; start < data.file.size; start += CHUNK_SIZE) {
  const chunk = data.file.slice(start, start + CHUNK_SIZE)
  const formData = new FormData()
  formData.append('file', chunk)
  formData.append('fileName', data.file.name)
  formData.append('chunkIndex', Math.floor(start / CHUNK_SIZE).toString())
  formData.append('totalChunks', totalChunks.toString())
  formData.append('uploadId', "1");

  try {
    const response = await fetch(
      'http://localhost:5000/api/v1/video/test-upload',
      {
        method: 'POST',
        body: formData
      }
    )

    if (!response.ok) throw new Error('Upload failed')

    uploadedChunks++
    setProgress(Math.round((uploadedChunks / totalChunks) * 100))
  } catch (e) {
    console.error('Error uploading chunk:', e)
    return
  }
}

setUploading(false)