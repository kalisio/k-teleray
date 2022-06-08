ARG KRAWLER_TAG

# 
# Make a Krawler image alias to be able to take into account the KRAWLER_TAG argument
#
FROM kalisio/krawler:${KRAWLER_TAG} AS krawler

#
# Make the job image using the krawler image alias
#
FROM node:16-buster-slim
LABEL maintainer="Kalisio <contact@kalisio.xyz>"

# Default environment variables
ENV CRON="0 */10 * * * *"

# Copy Krawler from the Krawler image alias
COPY --from=Krawler /opt/krawler /opt/krawler
WORKDIR /opt/krawler
RUN yarn link 
# Required as yarn does not seem to set it correctly
RUN chmod u+x /usr/local/bin/krawler

# Copy the job and install the dependencies
COPY jobfile.js package.json yarn.lock /opt/job/
WORKDIR /opt/job
RUN yarn && yarn link @kalisio/krawler

# Add default healthcheck
HEALTHCHECK --interval=1m --timeout=10s --start-period=1m CMD node /opt/krawler/healthcheck.js

# Run the job
CMD krawler --cron "$CRON" --run jobfile.js
