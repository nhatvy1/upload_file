import { Transform } from 'class-transformer'

export const TrimAllSpaces = () => {
  return Transform(({ value }) =>
    typeof value === 'string' ? value?.trim().replace(/\s+/g, ' ') : value
  )
}
