const display = document.getElementById("display");
const input = document.getElementById("input");
const btn = document.getElementById("btn");

const base_url = "http://localhost:8000";

input.focus();

btn.addEventListener("click", async () => {
  await handleclick();
});

setInterval(refresh, 1000);

async function refresh() {
  const llm_response = await get();

  if (!llm_response.result) {
    console.log("⚠️ Error getting llm response");
  }
  const text = llm_response.result;
  display.textContent = text;
}

async function handleclick() {
  const prompt = input.value;
  input.value = "";

  const response = await send(prompt);

  if (response.status != "ok") {
    console.log("⚠️ Error posting prompt");
    return "";
  }
}

async function get() {
  const url = `/output`;
  try {
    const output = await fetch(url);
    return await output.json();
  } catch (err) {
    console.log(`⚠️ Error calling ${url}\n`, err);
    return { result: "" };
  }
}

async function send(prompt) {
  const url = `/send`;
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: prompt }),
  };

  try {
    const response = await fetch(url, payload);
    return await response.json();
  } catch (err) {
    console.log(
      `⚠️ Error calling ${url}\nPayload: ${JSON.stringify(payload)}\n`,
      err,
    );
    return { status: "error" };
  }
}
