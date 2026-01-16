export async function onRequest(context) {
    const url = new URL(context.request.url);
    const host = url.searchParams.get("host");
    const port = url.searchParams.get("port");

    if (!host) {
        return new Response(
            JSON.stringify({error: "Missing host parameter"}),
            { status: 400 , headers: { "content-type": "application/json" }}
        )
    }
    if (!port) {
        let port = 25565;
    }

    const mcsrvApi = `https://api.mcsrvstat.us/3/${host}`

    const res = await fetch(mcsrvApi, {
        headers: { "User-Agent": "StatusPage/1.0" }
    });

    const text = await res.text();

    let data
    try {
        data = JSON.parse(text);
    } catch {
        return new Response(
            JSON.stringify({
                error: "Failed to parse JSON response from MCSRV API",
                raw: text
                }
            ),
            { status: 502, headers: { "content-type": "application/json" }}
        )
    }
    if (data.software == "velocity") {
        const pluginApi = `http://${data.hostname}:${port}/status`

        const pluginRes = await fetch(pluginApi);

        const pluginText = await pluginRes.text();

        let pluginData;
        try {
            pluginData = JSON.parse(pluginText);
        } catch {
            return new Response(
                JSON.stringify({
                    error: "Failed to parse JSON response from Velocity Plugin API",
                    raw: pluginText
                    }
                ),
                { status: 502, headers: { "content-type": "application/json" }}
            )
        }

        data.velocity = pluginData || {};

    }

    return new Response(
        JSON.stringify(data),
        {status: 200, headers: {"content-type": "application/json"}}
    );
}