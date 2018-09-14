FROM keymetrics/pm2:8-alpine

ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
ENV NPM_CONFIG_LOGLEVEL warn

# Installs latest Chromium (68) package.
ENV CHROME_BIN=/usr/bin/chromium-browser

RUN apk update && \
    apk upgrade && \
    echo @3.8 https://ftp.acc.umu.se/mirror/alpinelinux.org/v3.8/community >> /etc/apk/repositories && \
    echo @3.8 https://ftp.acc.umu.se/mirror/alpinelinux.org/v3.8/main >> /etc/apk/repositories && \
    apk add --no-cache \
    freetype@3.8 \
    harfbuzz@3.8 \
    chromium@3.8 \
    nss@3.8 \
    # other dependencies
    git \
    binutils-gold \
    curl \
    g++ \
    gcc \
    gnupg \
    libgcc \
    linux-headers \
    make \
    python

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install PM2
RUN pm2 install typescript \
    && pm2 install pm2-logrotate \
    && pm2 set pm2-logrotate:max_size 10M \
    && pm2 set pm2-logrotate:compress true \
    && pm2 set pm2-logrotate:rotateInterval '0 0 * * * *'

RUN mkdir -p /usr/app

WORKDIR /usr/app

VOLUME ["/usr/app"]

# ENTRYPOINT ["pm2-runtime", "start", "pm2.json"]