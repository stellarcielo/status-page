export async function onRequest(context) {
  const url = new URL(context.request.url)
  const host = url.searchParams.get("host")

  if (!host) {
    return new Response(
      JSON.stringify({ error: "host parameter required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  const api = `https://api.mcsrvstat.us/3/${host}`

  const res = await fetch(api, {
    headers: {
      "User-Agent": "status-page/1.0 (Cloudflare Pages)"
    }
  })

  const text = await res.text()

  let data
  try {
    data = JSON.parse(text)
  } catch {
    return new Response(
      JSON.stringify({
        error: "Invalid response from mcsrvstat.us",
        raw: text
      }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" }
      }
    )
  }

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=30"
    }
  })
}