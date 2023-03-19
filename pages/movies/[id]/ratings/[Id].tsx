import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './index.module.css'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../pages/api/auth/[...nextauth]'
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


export default function Rating({session}: any) {
  const [comment, setComment] = useState('')
  const [ratingValue, setRatingValue] = useState(0)

  const [movie, setMovie] = useState<Movie>()
  const [rating, setRating] = useState<Rating>()
  const [ratings, setRatings] = useState<Rating[]>([])
  const router = useRouter()
  const { id, Id } = router.query
  console.log( Id)
  useEffect(() => {
    ;(async () => {
      if (id) {
        const result = await fetch(
          `https://pqp1nh04y7.execute-api.ca-central-1.amazonaws.com/movies/${id}`,
        )
        const data = await result.json()
        setMovie(data)
      }
    })()
  }, [id])
  useEffect(() => {
    ;(async () => {
      if (id) {
        const result = await fetch(
          `https://pqp1nh04y7.execute-api.ca-central-1.amazonaws.com/movies/${id}/ratings`,
        )
        const data = await result.json()
        setRatings(data?.Ratings)
        const res = data?.Ratings?.find(
          (rating: Rating) => rating.Id === String(Id),
        )
        setRating(res)
        setComment(res?.Comment)
        setRatingValue(res?.RatingValue)
      }
    })()
  }, [id])

  const updateRating = async (e: React.FormEvent<HTMLFormElement>) => {
    if(!session?.accessToken) {
      signIn()
      return
    }
    e.preventDefault()
    const result = await fetch(
      `https://pqp1nh04y7.execute-api.ca-central-1.amazonaws.com/ratings/${
        Id
      }`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Id: Id,
          MovieId: id,
          Comment: comment,
          RatingValue: ratingValue,
          CreatedAt: rating?.CreatedAt,
        }),
      },
    )
    const data = await result.json()
    setRatings([...ratings, data])

    router.push('/')
    return
  }

  return (
    <div className={`${styles.container} container`}>
      <div className="row justify-content-center">
        <form onSubmit={updateRating}>
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
              Update Rating
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
