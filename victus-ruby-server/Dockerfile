# Build stage
FROM ruby:3.3.0-slim AS builder

RUN apt-get update -qq && apt-get install -y --no-install-recommends \
  build-essential \
  git \
  curl \
  ca-certificates \
  autoconf \
  automake \
  libtool \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Gemfile Gemfile.lock ./

ENV BUNDLE_WITHOUT="development test" \
  BUNDLE_DEPLOYMENT=1 \
  BUNDLE_PATH=/usr/local/bundle

RUN bundle install && rm -rf ~/.bundle /usr/local/bundle/cache

# Runtime stage
FROM ruby:3.3.0-slim

RUN apt-get update -qq && apt-get install -y --no-install-recommends \
  curl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV BUNDLE_WITHOUT="development test" \
  BUNDLE_DEPLOYMENT=1 \
  BUNDLE_PATH=/usr/local/bundle \
  RAILS_ENV=production \
  RAILS_LOG_TO_STDOUT=true

COPY --from=builder /usr/local/bundle /usr/local/bundle
COPY . .

EXPOSE 3000

CMD ["bundle", "exec", "rails", "s", "-b", "0.0.0.0", "-p", "3000"]
