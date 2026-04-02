CERTS_DIR   := victus-web-app/certs
CERT_FILE   := $(CERTS_DIR)/dev.victusjournal.com.pem
KEY_FILE    := $(CERTS_DIR)/dev.victusjournal.com-key.pem
DOMAIN      := dev.victusjournal.com

.PHONY: up down logs seed certs check-hosts

up: certs check-hosts
	docker compose --profile dev up -d

down:
	docker compose --profile dev down

logs:
	docker compose --profile dev logs -f

seed:
	docker compose --profile dev exec web rails db:seed

certs: $(CERT_FILE) $(KEY_FILE)

$(CERT_FILE) $(KEY_FILE):
	@command -v mkcert >/dev/null 2>&1 || { echo "Error: mkcert is not installed. Run: brew install mkcert"; exit 1; }
	@mkcert -install 2>/dev/null || true
	@mkdir -p $(CERTS_DIR)
	mkcert -cert-file $(CERT_FILE) -key-file $(KEY_FILE) $(DOMAIN)

check-hosts:
	@grep -q '$(DOMAIN)' /etc/hosts || { echo ""; echo "⚠ Add to /etc/hosts:"; echo "  127.0.0.1 $(DOMAIN)"; echo ""; echo "Run: echo '127.0.0.1 $(DOMAIN)' | sudo tee -a /etc/hosts"; echo ""; exit 1; }
