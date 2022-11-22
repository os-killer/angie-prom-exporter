FROM debian:11

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install --no-install-recommends --no-install-suggests --yes \
        ca-certificates curl lsb-release && \
    curl -o /etc/apt/trusted.gpg.d/angie-signing.gpg \
         https://angie.software/keys/angie-signing.gpg && \
    echo "deb https://download.angie.software/angie/debian/ `lsb_release -cs` main" \
        > /etc/apt/sources.list.d/angie.list && \
    apt-get update && \
    apt-get install --no-install-recommends --no-install-suggests --yes \
        angie angie-module-njs && \
    apt-get remove --autoremove --purge --yes \
        lsb-release && \
    apt-get clean && \
    rm -Rf /var/lib/apt/lists

COPY angie/angie.conf /etc/angie/
COPY angie/prom_parser.js /etc/angie/njs/
