#!/bin/sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
BOT_DIR="$SCRIPT_DIR/bot"
DASH_DIR="$SCRIPT_DIR/dashboard"
ECOSYSTEM_FILE="$SCRIPT_DIR/ecosystem.config.cjs"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    printf '%s\n' "Erro: comando '$1' não encontrado no PATH."
    exit 1
  fi
}

pull_latest() {
  repo_dir=$1
  repo_name=$2

  if [ ! -d "$repo_dir" ]; then
    printf '%s\n' "Erro: diretório não encontrado: $repo_dir"
    exit 1
  fi

  printf '%s\n' "Atualizando $repo_name..."
  (cd "$repo_dir" && git pull --ff-only origin main)
}

install_dependencies() {
  repo_dir=$1
  repo_name=$2

  printf '%s\n' "Instalando dependências em $repo_name..."
  (cd "$repo_dir" && npm install)
}

build_dashboard() {
  printf '%s\n' "Gerando build do dashboard..."
  (cd "$DASH_DIR" && npm run build)
}

restart_pm2() {
  printf '%s\n' "Reiniciando processos no PM2..."
  pm2 startOrRestart "$ECOSYSTEM_FILE" --update-env
  pm2 save
}

require_command git
require_command npm
require_command pm2

pull_latest "$BOT_DIR" "bot"
pull_latest "$DASH_DIR" "dashboard"

install_dependencies "$BOT_DIR" "bot"
install_dependencies "$DASH_DIR" "dashboard"

build_dashboard
restart_pm2

printf '%s\n' "Deploy concluído com sucesso."