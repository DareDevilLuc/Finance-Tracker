import type { User } from '@supabase/supabase-js'
import { ref } from 'vue'
import { supabase } from '../utils/supabase'

const user = ref<User | null>(null)

export function useAuth() {
  const signUp = async (email: string, password: string, username: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })
    if (error) throw error

    return data
  }

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    user.value = data.user

    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
  }

  const initAuth = () => {
    supabase.auth.getSession().then(({ data }) => {
      user.value = data.session?.user ?? null
    })

    supabase.auth.onAuthStateChange((_, session) => {
      user.value = session?.user ?? null
    })
  }

  return { signUp, signIn, signOut, initAuth }
}
