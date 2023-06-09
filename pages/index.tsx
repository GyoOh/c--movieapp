import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import MovieList from '../components/MovieList'
import MovieForm from '../components/MovieForm'
import { useRouter } from 'next/router'
import 'bootstrap/dist/css/bootstrap.min.css'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'



type Movie = {
  Id: string
  Title: string
  Year: number
  Genre: string
  Description: string
  CreatedAt: string
  Ratings: any
}

type Rating = {
  Id: string
  MovieId: string
  Comment: string
  RatingValue: number
  CreatedAt: string
}


export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions)
  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
    },
  }
}

export default function Home({session}: any) {
   

  const [movies, setMovies] = useState<Movie[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
 

  useEffect(() => {
    ;(async () => {
      const result = fetch(
        'https://pqp1nh04y7.execute-api.ca-central-1.amazonaws.com/movies',
      ).then((res) => res.json())
      const data = await result
      setMovies(data.sort((a: Movie, b: Movie) => b.CreatedAt.localeCompare(a.CreatedAt)))
    })()
  }, [])
  useEffect(() => {
    ;(async () => {
      const result = fetch(
        'https://pqp1nh04y7.execute-api.ca-central-1.amazonaws.com/ratings',
      ).then((res) => res.json())
      const data = await result
      setRatings(data.Ratings)
    })()
  }, [])

  const submitHandler = async (
    e: React.FormEvent<HTMLFormElement>,
    title: string,
    year: number,
    genre: string,
    description: string,
  ) => {
    e.preventDefault()
    if (!title || !year || !genre) return
    const result = await fetch(
      'https://pqp1nh04y7.execute-api.ca-central-1.amazonaws.com/movies',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Title: title,
          Year: year,
          Genre: genre,
          Description: description,
        }),
      },
    )
    const data = await result.json()
    setMovies([...movies, data])
  }
  const ratingHandler = async (
    e: React.FormEvent<HTMLFormElement>,
    comment: string,
    ratingValue: number,
    movieId: string,
  ) => {
    e.preventDefault()
    if (!comment || !ratingValue || !movieId) return
    const result = await fetch(
      `https://pqp1nh04y7.execute-api.ca-central-1.amazonaws.com/movies/${movieId}/ratings`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Comment: comment,
          RatingValue: ratingValue,
          MovieId: movieId,
        }),
      },
    )
    const data = await result.json()
    setRatings([...ratings, data])
  }

  const deleteHandler = async (id: string) => {
    setMovies(movies.filter((movie) => movie.Id !== id))
    const result = await fetch(
      `https://pqp1nh04y7.execute-api.ca-central-1.amazonaws.com/movies/${id}`,
      {
        method: 'DELETE',
      },
    )
  }


  return (
    <div className="app">
      <MovieForm
        onSubmit={submitHandler}
        movies={movies}
        ratingHandler={ratingHandler}
        session={session}
      />
          {movies.map((movie) => (
            <div className={`${styles.col} col`} key={movie.Id}>
              <MovieList
                movie={movie}
                onDelete={deleteHandler}
                ratings={ratings}
                setRatings={setRatings}
                session={session}
              />
            </div>
          ))}
    </div>
  )
}

