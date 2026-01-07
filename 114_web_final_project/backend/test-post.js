async function main() {
  const res = await fetch("http://localhost:5000/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "first todo" })
  });

  const data = await res.json();
  console.log("status:", res.status);
  console.log(data);
}

main().catch(console.error);
