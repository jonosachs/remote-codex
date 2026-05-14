from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import subprocess

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


def enter():
    subprocess.run(["tmux", "send-keys", "-t", "codex", "Enter"], check=True)


# default port 8000
@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(request, "index.html")


@app.post("/send")
def send(prompt: dict):
    text = prompt["prompt"]
    if text:
        subprocess.run(["tmux", "send-keys", "-t", "codex", "-l", text], check=True)
        subprocess.run(["sleep", "0.2"])
    enter()
    return {"status": "ok"}


@app.get("/output")
def get():
    result = subprocess.run(
        ["tmux", "capture-pan", "-pt", "codex"], capture_output=True, text=True
    )
    return {"result": result.stdout.rstrip()}
