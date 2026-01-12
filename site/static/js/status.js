const servers = [
  {
    name: "Main server",
    host: "mc.stellarcielo.com",
    proxy: true
  },
  {
    name: "Offline server",
    host: "test.stellarcielo.com",
    proxy: false
  }
]

const container = document.getElementById("servers")

async function loadStatus(server) {
  const res = await fetch(`/mc-status?host=${server.host}`)
  const data = await res.json()

  const div = document.createElement("div")
  div.innerHTML = `
    <h2>${server.name}</h2>
    <p>Status: ${data.online ? "🟢 Online" : "🔴 Offline"}</p>
    ${data.online ? `
      <p>Players: ${data.players.online}/${data.players.max}</p>
      <p>Version: ${data.version}</p>
    ` : ""}
  `
  container.appendChild(div)
}

servers.forEach(loadStatus)