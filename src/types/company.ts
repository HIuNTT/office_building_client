export interface Company {
  _id: string
  name: string
  taxCode: string
  capital: number
  industry: string
  employeeQuantity: number
  address: string
  phone: string
  area: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface CompanyEmployee {
  _id: string
  code: string
  identityNumber: string
  name: string
  birthday: string
  phone: string
  isDeleted: boolean
  company: string
  createdAt: string
  updatedAt: string
}
