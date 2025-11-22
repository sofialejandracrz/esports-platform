#!/bin/bash
set -e

echo "Configurando pg_hba.conf para usar scram-sha-256 authentication..."

# Reemplazar el archivo pg_hba.conf
cat > "$PGDATA/pg_hba.conf" <<EOF
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     scram-sha-256
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256
host    all             all             172.18.0.0/16           scram-sha-256
host    all             all             0.0.0.0/0               scram-sha-256
EOF

echo "Configuración de pg_hba.conf completada. Se aplicará en el próximo inicio."
