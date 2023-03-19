import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { signIn } from 'next-auth/react'
import styles from "./index.module.css"
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

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permanent: false,
  //     },
  //   }
  // }

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
    },
  }
}


export default function Movie({ session }: any) {
  const [title, setTitle] = useState('')
  const [year, setYear] = useState(0)
  const [genre, setGenre] = useState('')
  const [description, setdescription] = useState('')

  const [movie, setMovie] = useState<Movie>()
  const router = useRouter()
  const { id } = router.query
  useEffect(() => {
    ;(async () => {
      if (id) {
        const result = await fetch(
          `https://pqp1nh04y7.execute-api.ca-central-1.amazonaws.com/movies`,
        )
        const data = await result.json()
        const thisData = data?.find((movie: Movie) => movie.Id === (id))
        if (thisData) {
          setTitle(thisData.Title)
          setYear(thisData.Year)
          setGenre(thisData.Genre)
          setdescription(thisData.Description)
          setMovie(thisData)
        }
      }
    })()
  }, [id])
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    if(!session?.accessToken) {
      signIn()
      return
    }
    e.preventDefault()
    const result = await fetch(
      `https://pqp1nh04y7.execute-api.ca-central-1.amazonaws.com/movies/${
        id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Id: id,
          Title: title,
          Year: Number(year),
          Genre: genre,
          Description: description,
          CreatedAt: movie?.CreatedAt,
        }),
      },
    )
    const data = await result.json()

    router.push('/')
    return
  }

  return (
    <div className={`${styles.container} container`}>
      <div className="row justify-content-center">
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={title}
              id="title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <input
              type="text"
              className="form-control"
              placeholder="Genre"
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input
              type="number"
              className="form-control"
              placeholder="Year"
              id="year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">description</label>
            <textarea
              className="form-control"
              placeholder="description"
              id="description"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
            />
          </div>
          <div className="btn-div">
            <button type="submit" className="btn btn-primary">
              Update Movie
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                router.push('/')
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
