import { Tokens, User } from 'types/user'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserState {
  auth: Tokens
  user: User
  setAuth(auth: Tokens): void
  setUser(user: Partial<User>): void
  clear(): void
}

const defaultUserState: Pick<UserState, 'auth' | 'user'> = {
  auth: { accessToken: '', refreshToken: '' },
  user: { _id: '', createdAt: '', updatedAt: '', isDeteleted: false, avatarUrl: '', name: '' },
}

export const useUser = create<UserState>()(
  persist(
    (set, state) => ({
      ...defaultUserState,
      setAuth: (auth) => set({ auth }),
      setUser: (user) => set({ user: { ...state().user, ...user } }),
      clear: () => set({ ...defaultUserState }),
    }),
    {
      name: 'user',
      partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => ['auth'].includes(key))),
    },
  ),
)
