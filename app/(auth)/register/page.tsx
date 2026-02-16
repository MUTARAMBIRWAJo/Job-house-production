'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
} from '@/components/ui/card'
import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
} from '@/components/ui/select'
import { AlertCircle } from 'lucide-react'
import { registerWithoutEmail, testEmailProvider } from '@/lib/auth/fallback-auth'

export default function RegisterPage() {
      const router = useRouter()
      const [fullName, setFullName] = useState('')
      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')
      const [confirmPassword, setConfirmPassword] = useState('')
      const [role, setRole] = useState('customer')
      const [showPassword, setShowPassword] = useState(false)
      const [showConfirmPassword, setShowConfirmPassword] = useState(false)
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState('')
      const [success, setSuccess] = useState('')
      const [useFallback, setUseFallback] = useState(false)

      const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault()
            setLoading(true)
            setError('')
            setSuccess('')

            // Validate passwords match
            if (password !== confirmPassword) {
                  setError('Passwords do not match')
                  setLoading(false)
                  return
            }

            // Validate password length
            if (password.length < 8) {
                  setError('Password must be at least 8 characters')
                  setLoading(false)
                  return
            }

            try {
                  // Try registration with fallback
                  const result = await registerWithoutEmail(email, password, fullName, role)
                  
                  if (result.success) {
                        setSuccess(result.message || 'Registration successful! Redirecting to login...')
                        setTimeout(() => {
                              router.push('/login?registered=true')
                        }, 2000)
                  } else {
                        setError(result.error || 'Registration failed')
                  }
            } catch (err) {
                  console.error("Registration error:", err)
                  setError(err instanceof Error ? err.message : 'Registration failed')
            } finally {
                  setLoading(false)
            }
      }

      return (
            <div className="min-h-screen flex items-center justify-center bg-muted/50 py-12 px-4">
                  <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                              <div className="mx-auto mb-4">
                                    <img
                                          src="/Logo_for_JOB_HOUSE_PRODUCTION.png"
                                          alt="Job House Production"
                                          className="h-24 w-auto"
                                    />
                              </div>
                              <CardTitle className="text-2xl">Create Account</CardTitle>
                              <CardDescription>
                                    Join JOB HOUSE PRODUCTION gospel community
                              </CardDescription>
                        </CardHeader>
                        <CardContent>
                              <form onSubmit={handleSubmit} className="space-y-4">
                                    {error && (
                                          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                {error}
                                          </div>
                                    )}

                                    {success && (
                                          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm">
                                                {success}
                                          </div>
                                    )}

                                    <div className="space-y-2">
                                          <Label htmlFor="fullName">Full Name</Label>
                                          <div className="relative">
                                                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                      id="fullName"
                                                      type="text"
                                                      placeholder="John Doe"
                                                      value={fullName}
                                                      onChange={(e) => setFullName(e.target.value)}
                                                      required
                                                      disabled={loading}
                                                      className="pl-10"
                                                />
                                          </div>
                                    </div>

                                    <div className="space-y-2">
                                          <Label htmlFor="email">Email Address</Label>
                                          <div className="relative">
                                                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                      id="email"
                                                      type="email"
                                                      placeholder="you@example.com"
                                                      value={email}
                                                      onChange={(e) => setEmail(e.target.value)}
                                                      required
                                                      disabled={loading}
                                                      className="pl-10"
                                                />
                                          </div>
                                    </div>

                                    <div className="space-y-2">
                                          <Label htmlFor="password">Password</Label>
                                          <div className="relative">
                                                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                      id="password"
                                                      type={showPassword ? 'text' : 'password'}
                                                      placeholder="Create a password"
                                                      value={password}
                                                      onChange={(e) => setPassword(e.target.value)}
                                                      required
                                                      disabled={loading}
                                                      className="pl-10 pr-10"
                                                />
                                                <button
                                                      type="button"
                                                      onClick={() => setShowPassword(!showPassword)}
                                                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                                >
                                                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                          </div>
                                    </div>

                                    <div className="space-y-2">
                                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                                          <div className="relative">
                                                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                      id="confirmPassword"
                                                      type={showConfirmPassword ? 'text' : 'password'}
                                                      placeholder="Confirm your password"
                                                      value={confirmPassword}
                                                      onChange={(e) => setConfirmPassword(e.target.value)}
                                                      required
                                                      disabled={loading}
                                                      className="pl-10 pr-10"
                                                />
                                                <button
                                                      type="button"
                                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                                >
                                                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                          </div>
                                    </div>

                                    <div className="space-y-2">
                                          <Label htmlFor="role">I am registering as</Label>
                                          <Select value={role} onValueChange={setRole} disabled={loading}>
                                                <SelectTrigger>
                                                      <SelectValue placeholder="Select account type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                      <SelectItem value="customer">Fan / Worship Leader</SelectItem>
                                                      <SelectItem value="artist">Gospel Artist / Choir</SelectItem>
                                                </SelectContent>
                                          </Select>
                                    </div>

                                    <Button
                                          type="submit"
                                          className="w-full bg-secondary hover:bg-secondary/90 text-primary font-semibold"
                                          disabled={loading}
                                    >
                                          {loading ? (
                                                <>
                                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                      Creating account...
                                                </>
                                          ) : (
                                                'Create Account'
                                          )}
                                    </Button>
                              </form>

                              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-blue-700 text-sm">
                                          💡 <strong>Note:</strong> Account creation is instant! You'll be able to log in immediately after registration.
                                    </p>
                              </div>

                              <p className="mt-6 text-center text-sm text-muted-foreground">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-secondary font-semibold hover:underline">
                                          Sign in
                                    </Link>
                              </p>
                        </CardContent>
                  </Card>
            </div>
      )
}
