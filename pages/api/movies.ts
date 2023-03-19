import { NextApiRequest, NextApiResponse } from 'next'

interface Data {
  success: boolean
  data?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { method } = req
  switch (method) {
    case 'PUT':
      try {
        const movie = await fetch(
          `https://pqp1nh04y7.execute-api.ca-central-1.amazonaws.com/movies/${req.body.Id}}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
          },
        )
        const data = await movie.json()
        res.status(200).json({ success: true, data: data })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'DELETE':
      try {
        const movie = await fetch(
          `https://pqp1nh04y7.execute-api.ca-central-1.amazonaws.com/movies/`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
          },
        )
        const data = await movie.json()
        res.status(200).json({ success: true, data: data })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
