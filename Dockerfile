# Athlete Data Company — static SPA
# Build: docker build -t adc-v1 .
# Run:   docker run --rm -p 3000:80 adc-v1
# Note: Docker image names must be lowercase; label preserves "ADC-V1"

FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="ADC-V1" \
      org.opencontainers.image.description="Athlete Data Company — AI-Powered Athlete Discovery & Intelligence Marketplace" \
      org.opencontainers.image.version="1.1.0" \
      com.athletedata.image="ADC-V1"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

# Drop files that should not ship in the runtime image
RUN rm -rf /usr/share/nginx/html/.git \
           /usr/share/nginx/html/.dockerignore \
           /usr/share/nginx/html/Dockerfile \
           /usr/share/nginx/html/docker-compose.yml \
    && find /usr/share/nginx/html -name '.DS_Store' -delete

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
