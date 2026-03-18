import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PATCH') {
    const { title, description, sets, reps, frequency, observations, video_url, image_url, sort_order } = req.body
    const updates = {}
    if (title        !== undefined) updates.title        = title
    if (description  !== undefined) updates.description  = description
    if (sets         !== undefined) updates.sets         = sets
    if (reps         !== undefined) updates.reps         = reps
    if (frequency    !== undefined) updates.frequency    = frequency
    if (observations !== undefined) updates.observations = observations
    if (video_url    !== undefined) updates.video_url    = video_url
    if (image_url    !== undefined) updates.image_url    = image_url
    if (sort_order   !== undefined) updates.sort_order   = sort_order

    const { data, error } = await db.from('exercises').update(updates).eq('id', id).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await db.from('exercises').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  res.status(405).end()
}
