import { Transform, TransformFnParams } from 'class-transformer'
import { Types } from 'mongoose'

/**
 *
 * @param select field
 * @returns
 */
export const getSelectField = <T extends Record<string, any>>(
  select: (keyof T)[]
) => {
  return Object.fromEntries(select.map((element) => [element, 1]))
}

export function ToMongoId() {
  return Transform((params: TransformFnParams) => {
    if (params.value) {
      if (typeof params.value === 'string') {
        return new Types.ObjectId(params.value)
      }
      throw new Error('Invalid ObjectId: value must be a string')
    }
    return params.value
  })
}
