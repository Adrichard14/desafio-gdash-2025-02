# Desafio para o processo seletivo GDASH 2025/02

# Link para o vídeo não listado no youtube com a explicação da arquitetura:
https://youtu.be/C2ZnH2Dxyok

# Como executar o projeto utilizando docker

## Estrutura do Projeto
```
desafio-gdash-2025-02/
├── docker-compose.yml
├── gdash-backend/       (NestJS Backend)
├── gdash-front/         (React + Vite Frontend)
├── go-consumer/         (Consumer em Go)
├── python-job/          (Producer em Python)
└── mongo-data/          (Pasta para dados do MongoDB - criada automaticamente)
```


## Método 1: Usando Docker Compose

### Pré-requisitos
- Docker instalado
- Docker Compose instalado
- Git instalado

### Passo a Passo

1. **Clone o repositório (se ainda não tiver)**
```bash
git clone <seu-repositorio>
cd desafio-gdash-2025-02
```

2. **Execute o Docker Compose**
```bash
docker-compose up -d

docker-compose logs -f

docker-compose down
```

3. **Acesse os serviços**

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| Frontend | http://localhost:8080 | - |
| Backend API | http://localhost:3006 | - |
| RabbitMQ Management | http://localhost:15672 | guest / guest |
| MongoDB | localhost:27017 | root / example |

4. **Comandos úteis do Docker Compose**
```bash
docker-compose ps

docker-compose logs <nome-servico>

docker-compose up -d --build <nome-servico>

docker-compose down -v
```

---

## Método 2: Executar Sem Docker Compose

### Pré-requisitos
- Node.js 18+ (para NestJS e React)
- Python 3.8+ (para producer)
- Go 1.19+ (para consumer)
- MongoDB 6.0+
- RabbitMQ 3.12+

### Passo a Passo Manual

#### 1. Configurar e Iniciar RabbitMQ
```bash
docker run -d \
  --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=guest \
  -e RABBITMQ_DEFAULT_PASS=guest \
  rabbitmq:3-management

```

#### 2. Configurar e Iniciar MongoDB
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=example \
  -e MONGO_INITDB_DATABASE=gdash \
  mongo:6.0

```

#### 3. Configurar Backend (NestJS)
```bash
cd gdash-backend

npm install

echo "PORT=3006" > .env
echo "MONGO_URI=mongodb://root:example@localhost:27017/gdash?authSource=admin" >> .env
echo "RABBITMQ_URL=amqp://guest:guest@localhost:5672/" >> .env

npm run start:dev
```

#### 4. Configurar Frontend (React + Vite)
```bash
cd gdash-front

npm install

echo "VITE_API_URL=http://localhost:3006" > .env

npm run dev
```

#### 5. Configurar Python Producer
```bash
cd python-job

python -m venv venv

source venv/bin/activate
pip install -r requirements.txt

python main.py
python -m uvicorn main:app --reload --port 8000
```

#### 6. Configurar Go Consumer
```bash
cd go-consumer

go mod download

go run main.go
go build -o consumer
./consumer
```

---

## Verificação dos Serviços

Para verificar se todos os serviços estão funcionando corretamente:

1. **Frontend**: Acesse http://localhost:8080 (Docker) ou http://localhost:5173 (manual)
2. **Backend API**: Acesse http://localhost:3006/health (deve retornar status OK)
3. **RabbitMQ**: Acesse http://localhost:15672
4. **MongoDB**: Conecte via `mongosh` ou ferramenta GUI
5. **Python Producer**: Verifique logs no terminal
6. **Go Consumer**: Verifique logs no terminal

---

## Solução de Problemas Comuns

### Problema: Conexão com RabbitMQ falha
**Solução**: Verifique se o RabbitMQ está rodando e acessível:
```bash
docker ps | grep rabbitmq

curl -u guest:guest http://localhost:15672/api/health/checks/alarms
```

### Problema: MongoDB não conecta
**Solução**: Verifique credenciais e se o serviço está rodando:
```bash
mongosh "mongodb://root:example@localhost:27017/gdash?authSource=admin"
```

### Problema: Portas já em uso
**Solução**: Altere as portas no `docker-compose.yml` ou pare os serviços conflitantes:
```bash
sudo lsof -i :3006
```

### Problema: Erro de permissão no Docker
**Solução**: Execute com sudo ou adicione seu usuário ao grupo docker:
```bash
sudo usermod -aG docker $USER
```

---

## Comandos Rápidos de Referência

### Docker Compose
```bash
# Iniciar tudo
docker-compose up -d

# Parar tudo
docker-compose down

# Reconstruir e reiniciar
docker-compose up -d --build

# Ver logs combinados
docker-compose logs -f --tail=100
```

### Desenvolvimento Manual
```bash
# Sequência recomendada de inicialização:
# 1. RabbitMQ
# 2. MongoDB
# 3. Backend (NestJS)
# 4. Frontend (React)
# 5. Python Producer
# 6. Go Consumer
```

---

## Notas Importantes

1. **Primeira execução**: Pode levar alguns minutos para construir as imagens Docker
2. **Dependências**: O Docker Compose gerencia automaticamente a ordem de inicialização
3. **Persistência de dados**: Os dados do MongoDB são salvos na pasta `mongo-data/`
4. **Ambiente de desenvolvimento**: Use `docker-compose up` sem `-d` para ver logs em tempo real
5. **Limpeza**: Execute `docker-compose down -v` para remover todos os dados persistentes

Para mais informações, consulte a documentação específica de cada serviço nos respectivos diretórios.

## ✅ Andamento do desafio

- [✅] Python coleta dados de clima (Open-Meteo ou OpenWeather)  
- [ ] Python envia dados para RabbitMQ
  - [✅] - Configuração RabbitMQ
  - [✅] - Consulta de dados na API do OpenMeteor
  - [✅] - Coleta de dados
  - [✅] - Envio para a fila do RabbitMQ
- [] Worker Go consome a fila e envia para a API NestJS
  - [✅] - Configuração consumer RabbitMQ
  - [✅] - Implementação de sistema de retry básico
  - [✅] - ack/nack
  - [✅] - Configurações de ambiente
  - [✅] - Melhorias no código
- [ ] API NestJS:
  - [✅] Armazena logs de clima em MongoDB  
  - [✅] Expõe endpoints para listar dados  
  - [✅] Gera/retorna insights de IA (endpoint próprio)  
  - [✅] Exporta dados em CSV/XLSX  
  - [✅] Implementa CRUD de usuários + autenticação  
  - [✅] (Opcional) Integração com API pública paginada  
- [✅] Frontend React + Vite + Tailwind + shadcn/ui:
  - [✅] Dashboard de clima com dados reais  
  - [✅] Exibição de insights de IA  
  - [✅] CRUD de usuários + login  
  - [✅] (Opcional) Página consumindo API pública paginada  
- [✅] Docker Compose sobe todos os serviços  
- [✅] Código em TypeScript (backend e frontend)  
- [ ] Vídeo explicativo (máx. 5 minutos)  
- [✅] Pull Request via branch com seu nome completo  
- [✅] README completo com instruções de execução  
- [✅] Logs e tratamento de erros básicos em cada serviço  

---