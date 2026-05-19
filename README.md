
# Remote codex session

Run a remote codex session from your IPhone. \
Runs with `caffeinate -i` to keep connection alive (prevents Mac from sleeping while connected to power) 

## Screenshot 

<img src="screenshot.png" width="254" height="539" />

## Requirements

- Tailscale account with phone and computer connected `https://tailscale.com/`

## Instructions

1. Activate virtual environment:
    - `python -m venv .venv`
    - `source .venv/bin/activate`

2. Install dependencies:
    - `pip install -r requirements`

3. In the project root run: 
    - `zsh remote_codex.sh`

This will setup 2 detached tmux sessions: 
- `codex`: session running codex 
- `server`: session running uvicorn, serving a small API and front-end UI on port 8000

4. Point your IPhone to web url: `http://your-mac-tailscale-name:8000`

That's it!

## Tips

- Connect Mac to running tmux sessions with `tmux attach -t codex` or `tmux attach -t server`
- To kill sessions use: `Ctrl-C`, then `tmux kill-session -t codex` or `tmux kill-session -t server`
- On IPhone click `Add to Home Screen` on the web url for easy access in a dedicated browser session
