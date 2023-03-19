import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useNavigate } from 'react-router-dom'
import styles from './RatingList.module.css'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../pages/api/auth/[...nextauth]'
import { signIn } from 'next-auth/react'
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
export default function RatingList({
  rating,
  movie,
  RatingNum,
  deleteRating,
  session
}: {
  rating: Rating
  movie: Movie
  RatingNum: number
  deleteRating: (id: string) => void
  session: any
}) {
  const router = useRouter()
  const editHandler = () => {
    if(!session?.accessToken) {
      signIn()
      return
    }
    router.push(`/movies/${rating.MovieId}/ratings/${rating.Id}`)
  }
 
  const deleteHandler = async () => {
    if(!session?.accessToken) {
      signIn()
      return
    }
    deleteRating(rating.Id)
  }
  return (

    <div className={styles.review_list}>
      <div className="review-item" key={rating.CreatedAt}>
        <h6 className="review-title">Review {RatingNum}</h6>
        <p className="review-comment">{rating.Comment}</p>
        <p className="review-meta">
          {rating.RatingValue}
          <br />
          <span className="review-date">
            {new Date(rating.CreatedAt).toLocaleDateString()}
          </span>
        </p>
        <div className={`review-actions ${styles.review_btn_div}`}>
          <button
            className="btn btn-outline-primary btn-effect"
            onClick={editHandler}
          >
            Edit
          </button>
          <button
            className="btn btn-outline-primary btn-effect"
            onClick={deleteHandler}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
