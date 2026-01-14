const root = document.getElementById("status-root");

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
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
  const res = await fetch("/api/status");
  const data = await res.json();

  root.innerHTML = "";

  // 並び順制御
  const order = ["proxy", "velocity-child", "standalone"];

  order.forEach(kind => {
    Object.values(data)
        .filter(s => s.kind === kind)
        .forEach(s => root.appendChild(renderServer(s)));
  });
})();