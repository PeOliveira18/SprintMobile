# Ford ONE Mobile

Sprint de Mobile Development and IoT para o Desafio 2 da Ford: retencao e
fidelizacao de clientes no pos-venda.

## Objetivo

O aplicativo replica em mobile a proposta Ford ONE: uma plataforma de pos-venda
que usa VIN Share, inteligencia preditiva, telemetria IoT e jornada
personalizada para manter o cliente conectado a rede Ford.

A solucao foi alinhada a proposta da API `SprintSOA`: concessionarias, clientes,
veiculos por VIN, ordens de servico, leads de retencao e dashboard executivo.

## Como atende a sprint

- React Native com Expo e TypeScript.
- Navegacao com Expo Router em `src/app`.
- Consumo de API externa com Axios usando a API oficial da NHTSA.
- Service layer em `src/services`.
- Hooks reutilizaveis em `src/hooks`.
- Estados de loading, erro, vazio e retry.
- Cache local de campanhas com AsyncStorage.
- Conta local com cadastro/login em Expo SecureStore, usando Keychain no iOS
  e Keystore no Android.
- Estado assincrono
- Interceptors de request/response no Axios.
- Notificacao local ao criar lead de retencao.
- Identidade visual Ford ONE baseada no material da proposta final.

## Arquitetura

```txt
src/
  app/
    _layout.tsx
    conta.tsx
    (tabs)/
      _layout.tsx
      index.tsx
      campanha.tsx
      concessionarias.tsx
      iot.tsx
      lancamentos.tsx
      perfil.tsx
      servicos.tsx
    clientes/[id].tsx

  components/
    ActionButton.tsx
    CustomerCard.tsx
    EmptyState.tsx
    ErrorMessage.tsx
    FordOneHeader.tsx
    Loading.tsx
    MetricCard.tsx
    OneCard.tsx
    ServiceOrderCard.tsx
    StatusBadge.tsx
    TelemetryCard.tsx
    VehicleBanner.tsx

  hooks/
    useAccountSession.ts
    useCampaigns.ts
    useCustomerDetails.ts
    useCustomers.ts
    useDeviceBattery.ts
    useServiceOrders.ts
    useTelemetry.ts

  screens/
    AccountScreen.tsx
    CampaignScreen.tsx
    CustomerDetailsScreen.tsx
    DashboardScreen.tsx
    DealershipsScreen.tsx
    IoTScreen.tsx
    LaunchesScreen.tsx
    ProfileUseScreen.tsx
    ServicesOneScreen.tsx

  services/
    accountStorage.ts
    api.ts
    campaignStorage.ts
    notificationService.ts
    retentionService.ts

  types/
    account.ts
    customer.ts

  mocks/
    retention.ts
```

## API consumida

Base URL:

```txt
https://api.nhtsa.gov
```

Endpoint usado:

- `GET /recalls/recallsByVehicle?make=Ford&model=:model&modelYear=:year`:
  consulta recalls reais por modelo e ano de veiculos Ford.

Os clientes e leituras IoT sao datasets simulados para representar o contexto
de CRM e sensores do desafio 2. Esses dados sao enriquecidos com os recalls
reais retornados pela NHTSA.

## Telas Ford ONE

- Resumo: VIN Share, veiculos na rede, leads abertos, receita e recomendacao da IA.
- Perfil: perguntas de uso do veiculo para personalizar ofertas e servicos.
- Servicos: garantia proxima do fim, comparativo Rede Ford vs. fora da rede e CTA de revisao.
- Modelos: recomendacoes de lancamentos Ford com base no perfil do cliente.
- Concessionarias: ranking de unidades por experiencia, VIN Share e receita.
- IA Ford: telemetria, saude do veiculo, sensores simulados e bateria real do dispositivo.
- Minha conta: cadastro, login, sessao local e dados do perfil no SecureStore.
- Plano do cliente: VIN, concessionaria, lead sugerido, recalls e ordens.
- Leads: rota interna para criar acao de retencao, salvar localmente e disparar notificacao.

## Como rodar

```bash
npm install
npx expo start --clear --lan
```
