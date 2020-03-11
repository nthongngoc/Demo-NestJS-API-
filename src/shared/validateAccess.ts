export interface ValidateAccess {
  data: any
  credentials: Credentials
}

export interface Credentials {
  _id?: string
  phoneNumber?: string
  email?: string
  role?: string
  isAdmin?: boolean
}

export const ValidateAccessToSingle = ({data, credentials}: ValidateAccess) => {
  if (!data || Array.isArray(data)) {
    return {
      validData: null
    }
  }

  const { _id, isAdmin } = credentials

  if (isAdmin) {
    return {
      validData: data
    }
  }

  if ((data.createdBy && _id == data.createdBy )|| _id == data._id) {
    return {
      validData: data
    }
  }

  throw {
    code: 403,
    name: 'ValidationError',
  }
}

export const ValidateAccessToList = ({ data, credentials }: ValidateAccess) => {
  if (!data.length) {
    return  {
      validData: [],
      validDataLength: 0,
    }
  }

  const { _id, isAdmin } = credentials

  if (isAdmin) {
    return {
      validData: data,
      validDataLength: data.length,
    }
  }

  let validDataLength = 0

  const validData = data.map(each => {
    if (each.createdBy && _id == each.createdBy) {
        validDataLength++
        return each
    }
    return null
  })

  return {
    validData,
    validDataLength,
  }
}
