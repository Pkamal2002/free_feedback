'use client'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { FiMail, FiArrowRight } from 'react-icons/fi'
import { useTheme } from 'next-themes'
import { BsSun, BsMoon } from 'react-icons/bs'

const VerifyAccount = () => {
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const { theme, setTheme } = useTheme()

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  })
  

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    // console.log(data)
    // console.log({username: params.username})
     const packet = {
      username: params.username,
      code: data.code,
    }
    console.log(packet)
    try {
       const response = await axios.post<ApiResponse>(`/api/users/verify-code`, packet);
      toast.success(response.data.message)
      router.push('/sign-in')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          'An error occurred while verifying your account. Please try again later.'
      )
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#1f2937' : '#fff',
            color: theme === 'dark' ? '#fff' : '#111827',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 right-4 z-50"
      >
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <BsSun className="w-5 h-5 text-yellow-400" />
          ) : (
            <BsMoon className="w-5 h-5 text-indigo-600" />
          )}
        </button>
      </motion.div>

      <div className="w-full max-w-md p-8 mx-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center">
            <h1 className="text-3xl font-bold text-white">Verify Your Account</h1>
            <p className="text-indigo-100 mt-2">
              Enter the verification code sent to your email
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full mb-4">
                  <FiMail className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>

              {/* Verification Code Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  {...form.register('code')}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 text-center tracking-widest text-lg"
                  placeholder="XXXXXX"
                  maxLength={6}
                />
                {form.formState.errors.code && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.code.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center justify-center"
              >
                Verify Account
                <FiArrowRight className="ml-2" />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

export default VerifyAccount