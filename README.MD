# UPS Send Mail

Pequena API desenvolvida em **Node.js** para receber notificações de um módulo UPS (nobreak) e enviar um e-mail com os detalhes do evento e um arquivo ZIP contendo os logs do equipamento.

Este projeto foi criado como uma **Proof of Concept (POC)** para validar a comunicação entre um dispositivo embarcado e uma API hospedada na Vercel.

## Funcionalidades

* Recebe requisições HTTP `POST` em formato JSON.
* Autenticação por API Key (`x-api-key`).
* Envia e-mail em formato HTML.
* Anexa um arquivo ZIP recebido em Base64.
* Página HTML para testes da API.

## Tecnologias

* Node.js
* Nodemailer
* Dotenv

## Instalação

Clone o repositório:

```bash
git clone <repositorio>
cd ups-send-mail
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env.local` com as seguintes variáveis:

```text
API_KEY=sua_api_key
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_aplicativo
```

## Configuração do Gmail

Este projeto utiliza o **Gmail** como servidor SMTP através do **Nodemailer**.

Para que o envio de e-mails funcione, **não utilize a senha da sua conta Google**.

É necessário:

1. Ativar a autenticação em duas etapas na sua conta Google.
2. Gerar uma **Senha de Aplicativo (App Password)**.
3. Utilizar essa senha no campo `EMAIL_PASS`.

A senha de aplicativo é utilizada exclusivamente para autenticação SMTP e é a forma recomendada pelo Google para aplicações como esta.

## Executando

```bash
npm run dev
```

O servidor será iniciado em:

```text
http://localhost:3000
```

A página de testes estará disponível em:

```text
http://localhost:3000
```

## Endpoint

### POST `/api/send`

Cabeçalhos:

```http
Content-Type: application/json
x-api-key: SUA_API_KEY
```

Exemplo de payload:

```json
{
    "nome": "Módulo UPS",
    "serial": "UP-0001",
    "firmware": "1.0.0",
    "detalhe": "Falha durante teste.",
    "zipFileName": "logs.zip",
    "zipContent": "<arquivo em Base64>"
}
```

Resposta de sucesso:

```json
{
    "success": true
}
```

## Página de Testes

O projeto inclui um `index.html` que permite:

* Informar os dados do equipamento.
* Selecionar um arquivo ZIP.
* Informar a API Key.
* Enviar a requisição para a API.

Essa página existe apenas para facilitar os testes durante o desenvolvimento.

## Observações

* Este projeto foi desenvolvido como uma **POC**.
* O único cliente previsto é o próprio módulo UPS.
* O envio dos arquivos é realizado em Base64 dentro do JSON para simplificar a implementação no firmware do dispositivo.
* Quando hospedado na Vercel, lembre-se de que existe um limite de **4,5 MB** para o corpo da requisição (request body), incluindo o conteúdo em Base64.

## Licença

Este projeto é disponibilizado apenas para fins de estudo, testes e validação de conceito.
