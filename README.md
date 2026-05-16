# Remote codex session

Run a remote codex session from your IPhone. \
Runs with `caffeinate -i` to keep connection alive (prevents Mac from sleeping while connected to power) 
Work in progress..

## Requirements

- Tailscale account with phone and computer connected `https://tailscale.com/`
- Virtual environment (.venv) with the following installed:
    - tmux `brew install tmux`
    - fastapi `pip install "fastapi[standard]"`
    - uvicorn `pip install uvicorn`

## Usage

- On Mac terminal run: `zsh remote_codex.sh`

This will setup 2 detached tmux sessions:
`codex` - session running codex
`server` - session running uvicorn to serve a small server and front-end UI to interact with codex

- Point your IPhone to web url: `http://your-mac-tailscale-name:8000`

That's it!

**TIPS:**

- Connect Mac to running tmux sessions with `tmux attach -t codex` or `tmux attach -t server`
- To kill sessions use: `Ctrl-C`, then `tmux kill-session -t codex` or `tmux kill-session -t server`
- On IPhone click `Add to Home Screen` on the web url for easy access in a dedicated browser session
