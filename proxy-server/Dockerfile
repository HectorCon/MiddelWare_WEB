FROM node:18-alpine

WORKDIR /app

# Copy package.json first
#
# NOTE: CI or other callers sometimes use the repository root as the build
# context and pass this Dockerfile with "-f proxy-server/Dockerfile". In
# that case the package.json and app files live under the `proxy-server/`
# path relative to the build context. To be resilient to that usage we copy
# from `proxy-server/` explicitly. If you build with the `proxy-server`
# directory as the build context (recommended for local builds) you can
# instead run:
#   docker build -f proxy-server/Dockerfile proxy-server
# or build from repo root with:
#   docker build -f proxy-server/Dockerfile .

# Copy package.json from the repository (works when build context is repo root)
COPY proxy-server/package.json .

# Install dependencies using the recommended flag
RUN npm install --omit=dev

# Copy the rest of the application (from repo root build context)
COPY proxy-server .

EXPOSE 3000

CMD ["npm", "start"]