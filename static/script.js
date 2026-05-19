const display = document.getElementById("display");
const input = document.getElementById("input");
const send_btn = document.getElementById("send");
const up_btn = document.getElementById("up");
const down_btn = document.getElementById("down");
const esc_btn = document.getElementById("esc");

// Special (non-literal) codex keys
const keys = { esc: "Escape", enter: "Enter", tab: "Tab" };

input.focus();

send_btn.addEventListener("click", async () => {
  await handletext();
});
up_btn.addEventListener("click", async () => {
  await handlekey("Up");
});
down_btn.addEventListener("click", async () => {
  await handlekey("Down");
});
esc_btn.addEventListener("click", async () => {
  await handlekey("Escape");
});

// Scroll to bottom
refresh().then(() => {
  scrollToBottom();
});

function scrollToBottom() {
  display.scrollTop = display.scrollHeight;
}

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

async function handletext() {
  const command = input.value.trim().toLowerCase();

  // Check if prompt is a special key
  if (command in keys) {
    handlekey(keys[command]);
    return;
  }

  let data = { text: input.value };
  let url = "/text";

  // Clear input textarea
  input.value = "";

  const response = await post(url, data);

  if (!response || response.status != "ok") {
    console.error("⚠️ Error posting prompt", "\n\nReason:", response.reason);
  }

  refresh();
  scrollToBottom();
}

async function handlekey(key) {
  const url = "/key";
  const data = { key: key };
  const response = await post(url, data);

  if (!response || response.status != "ok") {
    console.error("⚠️ Error posting key", "\n\nReason:", response.reason);
  }

  refresh();
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
