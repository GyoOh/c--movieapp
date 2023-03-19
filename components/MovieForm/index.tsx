import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from './MovieForm.module.css'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../pages/api/auth/[...nextauth]'
import { signIn } from 'next-auth/react'
type Movie = {
  Id: string
  Title: string
  Year: number
  Genre: string
  Discription: string
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
export default function MovieForm({
  onSubmit,
  movies,
  ratingHandler,
  session
}: {
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    title: string,
    year: number,
    genre: string,
    discription: string,
  ) => void
  movies: Movie[]
  ratingHandler: (
    e: React.FormEvent<HTMLFormElement>,
    comment: string,
    ratingValue: number,
    movieId: string,
  ) => void
  session: any
}) {
  const [title, setTitle] = useState('')
  const [year, setYear] = useState(0)
  const [genre, setGenre] = useState('')
  const [discription, setDiscription] = useState('')
  const [movieId, setMovieId] = useState(movies.length > 0 ? movies[0].Id : 0)

  useEffect(() => {
    setMovieId(movies.length > 0 ? movies[0].Id : 0)
  }, [movies])

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    if(!session?.accessToken) {
      signIn()
      return
    }
    e.preventDefault()
    onSubmit(e, title, year, genre, discription)
    setTitle('')
    setYear(0)
    setGenre('')
    setDiscription('')
  }
  const addRating = (e: React.FormEvent<HTMLFormElement>) => {
    if(!session?.accessToken) {
      signIn()
      return
    }
    e.preventDefault()
    ratingHandler(e, comment, Number(ratingValue), String(movieId))
    setComment('')
    setRatingValue(0)
  }

  const [comment, setComment] = useState('')
  const [ratingValue, setRatingValue] = useState(0)

  return (
    <div className="form-div">
      <form onSubmit={submitHandler}>
        <h3 className={styles.form_h3}>Add Movie</h3>
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
          <label htmlFor="discription">Discription</label>
          <textarea
            className="form-control"
            placeholder="Discription"
            id="discription"
            value={discription}
            onChange={(e) => setDiscription(e.target.value)}
          />
        </div>
        <div className="btn-div">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setTitle('')
              setYear(0)
              setGenre('')
              setDiscription('')
            }}
          >
            Cancel
          </button>
        </div>
      </form>
      {/* make rating form */}
      <form onSubmit={addRating}>
      <h3 className={styles.form_h3}>Add Rating</h3>
        <div className="form-group">
          {/* label for movie  */}
          <label htmlFor="movie">Select Movie</label>
          {/* select for movie */}
          {/* make defualt movieId is first's Id */}
          <select
            className="form-control"
            id="movie"
            value={movieId}
            onChange={(e) => setMovieId(String(e.target.value))}
          >
            {movies.map((movie) => (
              <option key={movie.Id} value={movie.Id}>
                {movie.Title}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="comment">Comment</label>
          <textarea
            className="form-control"
            placeholder="Comment"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ratingValue">Rating </label>
          <input
            type="number"
            className="form-control"
            placeholder="Rating"
            id="ratingValue"
            value={ratingValue}
            onChange={(e) => setRatingValue(Number(e.target.value))}
          />
        </div>
        <div className="btn-div">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setComment('')
              setRatingValue(0)
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
