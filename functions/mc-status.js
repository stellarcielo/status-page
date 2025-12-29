export async function onRequest(context) {
  const url = new URL(context.request.url)
  const host = url.searchParams.get("host")

  if (!host) {
    return new Response(
      JSON.stringify({ error: "host parameter required" }),
      { status: 400 }
    )
  }

  const api = `https://api.mcsrvstat.us/2/${host}`
  const res = await fetch(api)
  const data = await res.json()

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=30"
    }
  })
}