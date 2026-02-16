'use client'

import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

interface Profile {
      id: string
      email: string
      full_name: string
      role: 'admin' | 'artist' | 'customer' | 'editor'
      avatar_url?: string
      phone?: string
      bio?: string
      is_verified: boolean
      two_factor_enabled: boolean
}

interface UseAuthReturn {
      user: User | null
      profile: Profile | null
      isLoading: boolean
      isAdmin: boolean
      isArtist: boolean
      isCustomer: boolean
      isAuthenticated: boolean
      refreshUser: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
      const [user, setUser] = useState<User | null>(null)
      const [profile, setProfile] = useState<Profile | null>(null)
      const [isLoading, setIsLoading] = useState(true)
      const supabase = createClient()

      useEffect(() => {
            const getUser = async () => {
                  const { data: { user } } = await supabase.auth.getUser()
                  setUser(user)

                  if (user) {
                        const { data: profile } = await supabase
                              .from('profiles')
                              .select('*')
                              .eq('id', user.id)
                              .single()

                        setProfile(profile)
                  }

                  setIsLoading(false)
            }

            getUser()

            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                  async (event, session) => {
                        setUser(session?.user ?? null)

                        if (session?.user) {
                              const { data: profile } = await supabase
                                    .from('profiles')
                                    .select('*')
                                    .eq('id', session.user.id)
                                    .single()

                              setProfile(profile)
                        } else {
                              setProfile(null)
                        }

                        setIsLoading(false)
                  }
            )

            return () => {
                  subscription.unsubscribe()
            }
      }, [])

      const refreshUser = async () => {
            setIsLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            if (user) {
                  const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single()

                  setProfile(profile)
            } else {
                  setProfile(null)
            }
            setIsLoading(false)
      }

      const isAdmin = profile?.role === 'admin'
      const isArtist = profile?.role === 'artist'
      const isCustomer = profile?.role === 'customer'

      return {
            user,
            profile,
            isLoading,
            isAdmin,
            isArtist,
            isCustomer,
            isAuthenticated: !!user,
            refreshUser
      }
}
