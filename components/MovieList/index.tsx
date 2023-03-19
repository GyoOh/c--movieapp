import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import RatingList from '../RatingList'
import styles from './MovieList.module.css'
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

interface Props {
  movie: Movie
  onDelete: (id: string) => void
  ratings: Rating[]
  setRatings: (ratings: Rating[]) => void
  session: any
}

const MovieList: React.FC<Props> = ({
  movie,
  onDelete,
  ratings,
  setRatings,
  session
}) => {
  const router = useRouter()
  const thisMovieRatings = ratings
    ?.filter((rating) => rating.MovieId == movie.Id)
    .sort((a, b) => (a.Id > b.Id ? 1 : -1))

  // Navigate to movies/[id] page
  const EditHandler = () => {
    if(!session?.accessToken) {
      signIn()
      return
    }
    router.push(`/movies/${movie.Id}`)
  }

  // Delete movie
  const deleteHandler = async () => {
    if(!session?.accessToken) {
      signIn()
      return
    }
    onDelete(movie.Id)
  }
  const deleteRating = async (id: string) => {
    const res = await fetch(
      `https://pqp1nh04y7.execute-api.ca-central-1.amazonaws.com/ratings/${id}`,
      {
        method: 'DELETE',
      },
    )
    setRatings(ratings.filter((rating) => rating.Id !== id))
  }

  return (
    <div className={`card mb-3 ${styles.movieCard} bg-lightblue`}>
    <div className="card-body card-body-div">
      <div className={styles.movie_list}>
      <h2 className="card-title">{movie.Title}</h2>
      <p className="card-text">
        <strong>Genre:</strong> {movie.Genre}
      </p>
      <p className="card-text">
        <strong>Year:</strong> {movie.Year}
      </p>
      <p className="card-text">
        <strong>Description:</strong> {movie.Discription}
      </p>
      <p className="card-text">
        <strong>Created At:</strong>{' '}
        {new Date(movie.CreatedAt).toLocaleDateString()}
      </p>
      <div className={`btn-group btn-div ${styles.btn_div}`}>
        <button
          type="button"
          className="btn btn-outline-primary btn-effect"
          onClick={EditHandler}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-outline-primary btn-effect"
          onClick={deleteHandler}
        >
          Delete
        </button>
      </div>
      </div>
      <div className={styles.review_list}>
        {thisMovieRatings.length > 0 ? (
          <ul className="list-unstyled">
            {thisMovieRatings.map(
              (rating, index) =>
                rating.MovieId === movie.Id && (
                  <li key={rating.CreatedAt} className="review-list-item">
                    <RatingList
                      rating={rating}
                      movie={movie}
                      RatingNum={index + 1}
                      deleteRating={deleteRating}
                      session={session}
                    />
                  </li>
                )
            )}
          </ul>
        ) : (
          <p className="no-ratings">No ratings yet</p>
        )}
      </div>
    </div>
  </div>
  )
}

export default MovieList
