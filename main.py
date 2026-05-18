from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import subprocess

app = FastAPI()

# Collect front-end resources (templates/ holds .html, static/ holds .js, .css)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


# Serves small front-end UI for interacting with agent
# default port 8000
@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(request, "index.html")


# Endpoint for literal text messages to running tmux session (-l = literal)
@app.post("/text")
def send(payload: dict):
    text = payload.get("text", None)

    if text is None:
        return {"status": "error", "reason": "no 'text' field found"}

    try:
        if text:
            subprocess.run(["tmux", "send-keys", "-t", "codex", "-l", text], check=True)
            # Codex requires pause between text input and 'Enter' (https://github.com/openai/codex/issues/12645)
            subprocess.run(["sleep", "0.2"])

        send_key("Enter")
    except subprocess.CalledProcessError as err:
        return {"status": "error", "reason": err.stderr or str(err)}

    return {"status": "ok"}


# Helper
def send_key(key: str):
    subprocess.run(["tmux", "send-keys", "-t", "codex", key], check=True)


# Endpoint for special keys (escape, enter, etc.)
@app.post("/key")
def key(payload: dict):
    key = payload.get("key", None)

    if key is None:
        return {"status": "error", "reason": "no 'key' field found"}

    try:
        send_key(key)
    except subprocess.CalledProcessError as err:
        return {"status": "error", "reason": err.stderr or str(err)}

    return {"status": "ok"}


# Endpoint fetching tmux pane (full session output)
@app.get("/output")
def get():
    try:
        result = subprocess.run(
            ["tmux", "capture-pane", "-pS", "-", "-t", "codex"],
            capture_output=True,
            text=True,
            check=True,
        )
    except subprocess.CalledProcessError as err:
        return {"status": "error", "reason": err.stderr or str(err)}

    return {"result": result.stdout.rstrip()}
