const servers = [
  {
    name: "Hub Server",
    host: "example.com"
  },
  {
    name: "Survival",
    host: "survival.example.com"
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