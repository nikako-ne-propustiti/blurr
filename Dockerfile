# Build frontend
FROM node:14-alpine AS frontend
ARG API_URL
ENV BACKEND_API_URL=$API_URL
RUN mkdir -p /myapp/frontend
WORKDIR /myapp/frontend
COPY frontend /myapp/frontend
RUN yarn && yarn build

# Build backend
FROM ruby:3.0.0 AS backend
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs imagemagick libmagic-dev libmagickwand-dev
RUN mkdir -p /myapp/backend
WORKDIR /myapp/backend
COPY --from=frontend /myapp/frontend/dist /myapp/backend/public
COPY backend/Gemfile /myapp/backend/Gemfile
COPY backend/Gemfile.lock /myapp/backend/Gemfile.lock
RUN bundle install
COPY backend /myapp/backend

ENV ENTRYKIT_VERSION 0.4.0
RUN wget -q https://github.com/progrium/entrykit/releases/download/v${ENTRYKIT_VERSION}/entrykit_${ENTRYKIT_VERSION}_Linux_x86_64.tgz \
  && tar -xvzf entrykit_${ENTRYKIT_VERSION}_Linux_x86_64.tgz \
  && rm entrykit_${ENTRYKIT_VERSION}_Linux_x86_64.tgz \
  && mv entrykit /bin/entrykit \
  && chmod +x /bin/entrykit \
  && entrykit --symlink

ENTRYPOINT [ \
  "prehook", "ruby -v", "--", \
  "prehook", "/myapp/backend/prehook", "--"]
CMD ["bundle", "exec", "rails", "s", "-p", "80", "-b", "0.0.0.0"]
