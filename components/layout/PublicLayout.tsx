import { signIn, signOut, useSession } from 'next-auth/client'
import Head from 'next/head'
import { ReactNode } from 'react'

interface AppProps {
  title?: string,
  children: ReactNode | ReactNode[]
}

const PublicLayout = ({ title = 'Next Movies', children }: AppProps) => {
  const [session, loading] = useSession()

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div className='grid grid-cols-5'>

        <div className='bg-gray-50 h-screen border-r p-8'>
          <h1 className='font-bold text-4'>Next Movies</h1>
        </div>

        <main className='bg-gray-50  h-screen col-span-3 p-8'>
          {children}
        </main>

        <div className='bg-gray-50  h-screen border-l p-8'>
          {loading ?
            <p>Loading ...</p>
            : !session ? <>
              Not signed in <br />
              <button onClick={(e) => {
                e.preventDefault()
                signIn('credentials', { username: 'yoann', password: '123456' })
              }}>Sign in</button>
            </>
              : <>
                Signed in
                Signed in as {session.user?.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
              </>}
        </div>

      </div>
    </>
  )
}

export default PublicLayout