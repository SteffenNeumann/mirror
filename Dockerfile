# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=23.7.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules — include devDependencies (tailwindcss) for the CSS build.
# NODE_ENV=production (set on the base image) would otherwise make npm ci skip them.
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY . .

# Build step (deploy-time only; keeps the dev workflow build-free):
#  - build:css  precompiles Tailwind to a static stylesheet (vendor/tailwind-built.css),
#               replacing the Play-CDN runtime. Scans index.html + app.js for classes.
#  - build:js   minifies app.js in place (~1.16MB -> ~640KB) for faster mobile parse.
# Prune devDependencies afterwards so the final image stays lean.
RUN npm run build && npm prune --omit=dev


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "start" ]
