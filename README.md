# 🎓 Quiz POO — SENAI CDI

App de estudos para a prova de **Programação Orientada a Objetos** em Java.

🔗 **Acesse online:** `https://SEU_USUARIO.github.io/quiz-poo/`

---

## 📱 Como publicar no GitHub Pages via Termux (Android)

### 1. Instalar o Termux
Baixe pelo **F-Droid** (recomendado) ou Play Store:
- F-Droid: https://f-droid.org/packages/com.termux/

---

### 2. Configurar o Termux (primeira vez)

```bash
# Atualizar pacotes
pkg update && pkg upgrade -y

# Instalar git e Node.js
pkg install git nodejs -y

# Verificar se instalou
git --version
node --version
npm --version
```

---

### 3. Configurar sua identidade no Git

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

---

### 4. Criar repositório no GitHub

1. Abra **github.com** no celular
2. Toque em **+** → **New repository**
3. Nome: `quiz-poo` *(deve ser igual ao `base` no vite.config.js)*
4. Deixe **Public**
5. **NÃO** marque "Add README" — deixe vazio
6. Toque em **Create repository**
7. Copie a URL: `https://github.com/SEU_USUARIO/quiz-poo.git`

---

### 5. Enviar o projeto para o GitHub

No Termux, navegue até a pasta do projeto e execute:

```bash
# Entrar na pasta (ajuste o caminho se necessário)
cd /sdcard/quiz-poo-web
# ou
cd ~/storage/shared/quiz-poo-web

# Iniciar repositório Git
git init
git branch -M main

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "feat: quiz POO com 70 questões"

# Conectar ao GitHub (troque SEU_USUARIO pelo seu usuário)
git remote add origin https://github.com/SEU_USUARIO/quiz-poo.git

# Enviar para o GitHub
git push -u origin main
```

> Quando pedir usuário e senha, use seu **usuário GitHub** e um **Personal Access Token**
> (não a senha da conta — veja passo 5.1 abaixo)

---

### 5.1 Criar Personal Access Token (PAT)

O GitHub não aceita senha comum — precisa de token:

1. GitHub → foto do perfil → **Settings**
2. Scroll até **Developer settings** (último item)
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token (classic)**
5. Note: `quiz-poo deploy`
6. Expiration: `90 days`
7. Marque: ✅ **repo** (acesso total a repositórios)
8. **Generate token**
9. **Copie o token agora** — só aparece uma vez!

Use esse token como senha quando o git pedir.

---

### 6. Ativar GitHub Pages

1. No repositório, vá em **Settings**
2. Menu lateral → **Pages**
3. Em **Source**, selecione: **GitHub Actions**
4. Salve

O deploy roda automaticamente a cada `git push`.
Aguarde ~2 minutos e acesse: `https://SEU_USUARIO.github.io/quiz-poo/`

---

### 7. Atualizar o app depois de mudanças

Quando editar o projeto, basta:

```bash
cd /sdcard/quiz-poo-web

git add .
git commit -m "fix: descrição da mudança"
git push
```

O GitHub Actions faz o build e deploy automático.

---

### 8. Guardar o token para não digitar sempre

```bash
# Salva credenciais em memória por 1 hora
git config --global credential.helper 'cache --timeout=3600'

# Ou salva permanentemente (menos seguro)
git config --global credential.helper store
```

---

## 💻 Rodar localmente (opcional)

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev
# Acesse: http://localhost:5173/quiz-poo/

# Gerar build de produção
npm run build
```

---

## 📁 Estrutura do projeto

```
quiz-poo-web/
├── index.html                  # Entry point HTML
├── vite.config.js              # Config Vite (base path)
├── package.json                # Dependências
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml          # Deploy automático GitHub Pages
└── src/
    ├── main.jsx                # Monta o React no DOM
    └── App.jsx                 # App completo (questões + lógica)
```

---

## ✨ Funcionalidades

- **70 questões** — múltipla escolha, múltiplas certas, completar lacuna, ache o erro, escrever código, adivinhar saída
- **Feedback imediato** com explicação detalhada ao errar
- **Estudo Rápido** com links para playlist Curso em Vídeo (Guanabara)
- **Ranking da turma** compartilhado via persistent storage
- **Filtro** por tema e tipo de questão
- **Quantidade configurável** — 5, 10, 15, 20, 30 ou todas

---

Feito para a turma de Tecnologia em Segurança Cibernética — SENAI CDI 2025–2027 🛡️
