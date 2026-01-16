export async function onRequest(context) {
    const url = new URL(context.request.url);
    const host = url.searchParams.get("host");
    const port = url.searchParams.get("port");

    if (!host) {
        return new Response(
            Json.stringify({ error: "Missing host parameter" }),
            { status: 400 , headers: { "content-type": "application/json" }}
        );
    }

    const results: Record<string, any> = {};
    const now = Date.now();

    // ===== Velocity Plugin =====
    try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${host}:${port}, {
            headers: { "accept": "application/json" }
        });

        if (!res.ok) throw new Error(`Velocity API returned ${res.status}`);

        const json = await res.json() as Record<string, any>;
        let totalOnline = 0;
        let totalMax = 0;
        let anyOnline = false;

        for (const [key, s] of Object.entries(json)) {
            totalOnline += s.players?.online ?? 0;
            totalMax += s.players?.max ?? 0;
            if (s.online) anyOnline = true;
            results[key] = {
                id: key,
                name: s.name,
                kind: "velocity-child",
                online: !!s.online,
                motd: s.motd,
                players: s.players,
                updated_at: s.updated_at
            };
        }

        };
    }

    // ===== Standalone / Direct (Parallel Fetch) =====
    const standaloneServers: Record<string, string> = {
        creative: "creative.example.com"
    };

    await Promise.all(Object.entries(standaloneServers).map(async ([id, host]) => {
        try {
            const res = await fetch(
                `https://api.mcsrvstat.us/3/${host}`,
                { headers: { "User-Agent": "StatusPage/1.0" } }
            );
            if (!res.ok) return;

            const j = await res.json();
            results[id] = {
                id,
                name: id.charAt(0).toUpperCase() + id.slice(1),
                kind: "standalone",
                online: j.online,
                players: {
                    online: j.players?.online ?? 0,
                    max: j.players?.max ?? 0
                },
                updated_at: now
            };
        } catch (e) {
            console.error(`Failed to fetch status for ${id}:`, e);
        }
    }));

    return new Response(JSON.stringify(results), {
        headers: { "content-type": "application/json" }
    });
}
