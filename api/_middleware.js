export default function middleware(req, ev) {
  const response = new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
  if (req.method === 'OPTIONS') return response
  return null
}
