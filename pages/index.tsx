import axios from 'axios'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import PublicLayout from '../components/layout/PublicLayout'


const Home = ({ movies }: any) => {
  return (
    <PublicLayout title='Home Page'>
      <p className='font-semibold'>Popular movies today</p>
      <div>
        {movies.map((movie: any) => (
          <div key={movie.id} >
            <Link href={`/movies/${movie.id}`}>
              <a>{movie.title}</a>
            </Link>
          </div>
        ))}
      </div>
    </PublicLayout>
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
