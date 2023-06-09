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

  const date = new Date(rating?.CreatedAt);
  const formattedDate = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const stars = ( rate: number ) => {
    let stars = "";
    for (let i = 0; i < 10; i++) {
      if (i < rate) {
        stars += "★";
      } else {
        stars += "☆";
      }
    }
    return <p className="Stars">{stars}</p>;
  };
  
  
  return (

    <div className={styles.review_list}>
        <div className={styles.review_meta}>
        <span className={`review-date ${styles.review_date}`}>
          {rating?.CreatedAt ? formattedDate : 'No date'}
        </span>
      </div>
    <div className="review-item" key={rating.CreatedAt}>
      <span className={`review-rate ${styles.review_rate}`}>
        {stars(rating.RatingValue)}
      </span>
      <div className={styles.review_top_line}></div>
      <p className={`review-comment ${styles.review_comment}`}>{rating.Comment}</p>
    
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
