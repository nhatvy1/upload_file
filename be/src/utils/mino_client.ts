export const urlResponseFromMinio = ({
  host = 'localhost',
  port,
  filename,
  bucket_name
}: {
  host?: string
  port?: string
  filename: string,
  bucket_name
}) => {
  return `http://${host}:${port}/${bucket_name}/${filename}`
}
