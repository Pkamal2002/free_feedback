'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function AuthStatus() {
  const { data: session } = useSession()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        {session ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800">Welcome 👋</h2>
            <p className="text-gray-600 mt-2">Signed in as <span className="font-medium">{session.user.email}</span></p>
            <button
              onClick={() => signOut()}
              className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-300"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-800">You are not signed in</h2>
            <p className="text-gray-600 mt-2">Please sign in to continue.</p>
            <button
              onClick={() => signIn()}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-300"
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  )
}
