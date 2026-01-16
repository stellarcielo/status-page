const root = document.getElementById("status-root");

const servers = [
  {
    name: "Main server",
    host: "mc.stellarcielo.com",
    port: 25464
  },
  {
    name: "Offline server",
    host: "example.stellarcielo.com",
    port: 0
  }
]

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

async function loadStatus(server) {
  const res = await fetch(`/api/status?host=${server.host}&port=${server.port}`);
  const data = await res.json();

  const div = document.createElement("div")
  div.innerHTML = `
    <div class="status-header">
        <span class="status-title">${server.name}</span>
        <span class="${data.online ? "online" : "offline"}">
            ${s.online ? "🟢 Online" : "🔴 Offline"}
        </span>
    </div>
    
    <div class="status-meta">
      Players: ${server.players.online} / ${server.players.max}
    </div>

    ${server.motd ? `<div>${server.motd}</div>` : ""}

    <div class="status-meta">
      Updated ${timeAgo(server.updated_at)}
    </div>
  `;

  return div;
}

function renderServer(s) {
  const div = document.createElement("div");
  div.className = `status-card ${s.kind}`;

  div.innerHTML = `
    <div class="status-header">
      <span class="status-title">${s.name}</span>
      <span class="${s.online ? "online" : "offline"}">
        ${s.online ? "🟢 Online" : "🔴 Offline"}
      </span>
    </div>

    <div class="status-meta">
      Players: ${s.players.online} / ${s.players.max}
    </div>

    ${s.motd ? `<div>${s.motd}</div>` : ""}

    <div class="status-meta">
      Updated ${timeAgo(s.updated_at)}
    </div>
  `;

  return div;
}

(async () => {
  root.innerHTML = "";
  for (const s of servers) {
    root.appendChild(await loadStatus(s));
  }
})();