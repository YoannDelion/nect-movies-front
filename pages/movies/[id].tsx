import { GetStaticProps } from 'next'
import axios from 'axios'
import MovieType from '../../types/MovieType'
import PublicLayout from '../../components/layout/PublicLayout'

interface AppProps {
  movie: MovieType
}

const MoviePage = ({ movie }: AppProps) => {

  return (
    <PublicLayout>
      <h1 className='font-bold text-4'>{movie.title}</h1>

      <p>{movie.overview}</p>

    </PublicLayout>
  )
}

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await axios.get('http://localhost:5000/movies/popular')
  const movies: MovieType[] = res.data.results


  // Get the paths we want to pre-render based on posts
  const paths = movies.map(movie => ({
    params: { id: movie.id.toString() },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let movie = {}

  try {
    const res = await axios.get(`http://localhost:5000/movies/${params?.id}`)
    movie = res.data
  } catch (error) {
    // gestion des erreurs?
  }

  return {
    props: {
      movie
    },
    revalidate: 86400 // 24 hours
  }
}

export default MoviePage
