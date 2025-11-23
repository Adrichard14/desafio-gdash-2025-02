# Desafio para o processo seletivo GDASH 2025/02

## ✅ Andamento do desafio

- [✅] Python coleta dados de clima (Open-Meteo ou OpenWeather)  
- [ ] Python envia dados para RabbitMQ
  - [✅] - Configuração RabbitMQ
  - [✅] - Consulta de dados na API do OpenMeteor
  - [✅] - Coleta de dados
  - [✅] - Envio para a fila do RabbitMQ
  - [ ] - Configurações de ambiente
- [] Worker Go consome a fila e envia para a API NestJS
  - [✅] - Configuração consumer RabbitMQ
  - [✅] - Implementação de sistema de retry básico
  - [✅] - ack/nack
  - [ ] - Configurações de ambiente
  - [ ] - Melhorias no código
- [ ] API NestJS:
  - [✅] Armazena logs de clima em MongoDB  
  - [✅] Expõe endpoints para listar dados  
  - [ ] Gera/retorna insights de IA (endpoint próprio)  
  - [ ] Exporta dados em CSV/XLSX  
  - [✅] Implementa CRUD de usuários + autenticação  
  - [ ] (Opcional) Integração com API pública paginada  
- [ ] Frontend React + Vite + Tailwind + shadcn/ui:
  - [✅] Dashboard de clima com dados reais  
  - [ ] Exibição de insights de IA  
  - [ ] CRUD de usuários + login  
  - [ ] (Opcional) Página consumindo API pública paginada  
- [ ] Docker Compose sobe todos os serviços  
- [ ] Código em TypeScript (backend e frontend)  
- [ ] Vídeo explicativo (máx. 5 minutos)  
- [ ] Pull Request via branch com seu nome completo  
- [ ] README completo com instruções de execução  
- [ ] Logs e tratamento de erros básicos em cada serviço  

---