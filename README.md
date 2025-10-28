# MiddelWare_WEB

Proxy server image build instructions

Recommended (local) build from `proxy-server` directory:

```powershell
# Build using proxy-server as build context
docker build -f proxy-server/Dockerfile proxy-server -t middelware/proxy-server:latest
```

Alternate (CI) build from repository root (this repo includes a Dockerfile that works when built from root):

```powershell
# Build from repo root while pointing Docker to the proxy-server Dockerfile
docker build -f proxy-server/Dockerfile . -t middelware/proxy-server:latest
```

Notes
- The `proxy-server/Dockerfile` was adjusted to copy files from `proxy-server/` when the build context is the repository root to avoid `COPY package.json: not found` errors in CI environments.
- If you prefer building with the `proxy-server` folder as build context, use the first command above.
