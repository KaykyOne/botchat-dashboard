# Bot Autoescola Ideal

## Comandos Prisma Essenciais

### Migration
```bash
# Criar nova migration após alterar schema.prisma
npx prisma migrate dev --name [nome_da_migration]

# Aplicar migrations pendentes
npx prisma migrate deploy

# Resetar banco de dados (CUIDADO: apaga tudo!)
npx prisma migrate reset
```

### Banco de Dados
```bash
# Sincronizar schema.prisma com banco (sem criar migration)
npx prisma db push

# Visualizar e gerenciar dados do banco com interface gráfica
npx prisma studio

# Verificar status das migrations
npx prisma migrate status
```

### Cliente Prisma
```bash
# Gerar/atualizar Prisma Client
npx prisma generate
```

## Configuração

Certifique-se de ter o arquivo `.env` com a `DATABASE_URL` configurada.
