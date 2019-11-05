ARG KRAWLER_TAG
FROM kalisio/krawler:${KRAWLER_TAG} AS Krawler


FROM node:8-buster-slim
LABEL maintainer="Kalisio <contact@kalisio.xyz>"

# Copy Krawler
COPY --from=Krawler /opt/krawler /opt/krawler
RUN echo ${KRAWLER_TAG} && cd /opt/krawler && yarn link && yarn link @kalisio/krawler

# Install the job
COPY config.js .
COPY jobfile.js .

# Add default healthcheck
HEALTHCHECK --interval=1m --timeout=10s --start-period=1m CMD node ./krawler/healthcheck.js

# Run the job
ENV NODE_PATH=/opt/krawler/node_modules
CMD node /opt/krawler --cron "0 */10 * * * *" jobfile.js