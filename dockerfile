ARG KRAWLER_TAG

# 
# Make a Krawler image alias to be able to take into account the KRAWLER_TAG argument
#
FROM kalisio/krawler:${KRAWLER_TAG} AS krawler

#
# Make the job image using the krawler image alias
#
FROM node:12-buster-slim
LABEL maintainer="Kalisio <contact@kalisio.xyz>"

ENV CRON="0 */10 * * * *"

# Copy Krawler from the Krawler image alias
COPY --from=Krawler /opt/krawler /opt/krawler
RUN cd /opt/krawler && yarn link && yarn link @kalisio/krawler

# Install the job
COPY jobfile.js .

# Add default healthcheck
HEALTHCHECK --interval=1m --timeout=10s --start-period=1m CMD node /opt/krawler/healthcheck.js

# Run the job
ENV NODE_PATH=/opt/krawler/node_modules
CMD node /opt/krawler --cron "$CRON" --run jobfile.js
