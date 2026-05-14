# Remote codex session

Shell script to run a remote codex session from your IPhone. \
Runs with `caffeinate -i` to keep connection alive (prevents Mac from sleeping) 

## Requirements

- Tailscale account with phone and computer connected `https://tailscale.com/`
- tmux `brew install tmux`
- ttyd `brew install ttyd`
- fastapi `pip install "fastapi[standard]"`

## Usage

- On Mac, run

`uvicorn main:app --host 0.0.0.0 --port 8000`

- Point your IPhone to web url 

`http://your-mac-tailscale-name:8000`


**TIPS:**

- Connect Mac to the running codex session with `tmux attach -t codex` in a new terminal window
- To kill use: `Ctrl-C` in the active ttyd window, then `tmux kill-session -t codex`
- On IPhone click `Add to Home Screen` on the web url for easy repeat access
