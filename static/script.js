const display = document.getElementById("display");
const input = document.getElementById("input");
const btn = document.getElementById("btn");

// Special (non-literal) codex keys
const keys = { esc: "Escape", enter: "Enter", tab: "Tab" };

input.focus();

btn.addEventListener("click", async () => {
  await handleclick();
});

// Scroll to bottom
refresh().then(() => {
  display.scrollTop = display.scrollHeight;
});

// Refresh temux stdout capture every x milliseconds
setInterval(refresh, 1000);

async function refresh() {
  const llm_response = await get();

  if (!llm_response.result) {
    console.error("⚠️ Error getting llm response");
  }
  const text = llm_response.result;
  display.textContent = text;
}

async function handleclick() {
  const command = input.value.trim().toLowerCase();
  let data = "";
  let url = "";

  // Check if prompt is a special key or text
  if (command in keys) {
    data = { key: keys[command] };
    url = "/key";
  } else {
    data = { text: input.value };
    url = "/text";
  }

  // Clear input textarea
  input.value = "";

  const response = await post(url, data);

  if (!response || response.status != "ok") {
    console.error("⚠️ Error posting prompt", "\n\nReason:", response.reason);
  }
}

async function get() {
  const url = "/output";
  try {
    const response = await fetch(url);
    const body = await response.text();

    if (!response.ok) return { status: "error", reason: body };

    const result = JSON.parse(body);
    return result;
  } catch (err) {
    console.error(`⚠️ Error calling ${url}\n`, err);
    return { status: "error", result: err.message || str(err) };
  }
}

function buildPayload(data) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
}

async function post(url, data) {
  const payload = buildPayload(data);
  try {
    const response = await fetch(url, payload);
    const body = await response.text();

    // HTTP-level failure: 400, 404, 422, 500, etc.
    // ok for HTTP status codes 200–299
    if (!response.ok) {
      return { status: "error", reason: body };
    }

    const result = JSON.parse(body);
    return result;
  } catch (err) {
    console.error(
      `⚠️ Error calling ${url}\nPayload: ${JSON.stringify(payload)}\n`,
      err,
    );
    return { status: "error", reason: err.message || str(err) };
  }
}
