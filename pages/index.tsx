import Head from 'next/head'
import { GetStaticProps } from 'next'
import axios from 'axios'
import { signIn, signOut, useSession } from 'next-auth/client'
import Link from 'next/link'


const Home = ({ movies }: any) => {
  const [session, loading] = useSession()

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <div className='grid grid-cols-5'>

        <div className='bg-gray-50 h-screen border-r p-8'>
          <h1 className='font-bold text-4'>Next Movies</h1>
        </div>

        <main className='bg-gray-50  h-screen col-span-3 p-8'>
          <p className="font-semibold">Popular movies today</p>
          <div>
            {movies.map((movie: any) => (
              <div key={movie.id} >
                <Link href={`/movies/${movie.id}`}>
                  <a>{movie.title}</a>
                </Link>
              </div>
            ))}
          </div>
        </main>

        <div className='bg-gray-50  h-screen border-l p-8'>
          {!session ? <>
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

export const getStaticProps: GetStaticProps = async () => {

  let movies = []
  let error: any

  try {
    const res = await axios.get('http://localhost:5000/movies/popular')
    movies = res.data.results
  } catch (error) {
    // gestion des erreurs?
  }

  return {
    props: {
      movies
    },
    revalidate: 86400 // 24 hours
  }
}

export default Home
