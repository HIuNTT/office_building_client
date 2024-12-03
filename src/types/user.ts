export interface User {
  _id: string
  createdAt: string
  updatedAt: string
  isDeteleted: boolean
  avatarUrl: string
  name: string
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}
