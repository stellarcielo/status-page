export async function onRequest() {
    interface ServerStatus {
        id: string;
        name: string;
        kind: "velocity-child" | "proxy" | "standalone";
        online: boolean;
        motd?: string;
        players: { online: number; max: number };
        updated_at: number;
    }

    const results: Record<string, ServerStatus> = {};
    const now = Date.now();

    // ===== Velocity Plugin =====
    try {
        const res = await fetch("http://VELOCITY_IP:PORT/status", {
            headers: { "accept": "application/json" }
        });
        const json = await res.json();

        let totalOnline = 0;
        let totalMax = 0;
        let anyOnline = false;

        for (const [key, s] of Object.entries<any>(json)) {
            totalOnline += s.players.online;
            totalMax += s.players.max;
            if (s.online) anyOnline = true;

            results[key] = {
                id: key,
                name: s.name,
                kind: "velocity-child",
                online: s.online,
                motd: s.motd,
                players: s.players,
                updated_at: s.updated_at
            };
        }

        results["velocity"] = {
            id: "velocity",
            name: "Velocity Proxy",
            kind: "proxy",
            online: anyOnline,
            players: { online: totalOnline, max: totalMax },
            updated_at: now
        };
    } catch (e) {
        results["velocity"] = {
            id: "velocity",
            name: "Velocity Proxy",
            kind: "proxy",
            online: false,
            players: { online: 0, max: 0 },
            updated_at: now
        };
    }

    // ===== Standalone / Direct =====
    const standaloneServers = {
        creative: "creative.example.com"
    };

    for (const [id, host] of Object.entries(standaloneServers)) {
        try {
            const res = await fetch(
                `https://api.mcsrvstat.us/3/${host}`,
                { headers: { "User-Agent": "StatusPage/1.0" } }
            );
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
        } catch {}
    }

    return new Response(JSON.stringify(results), {
        headers: { "content-type": "application/json" }
    });
}