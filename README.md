# npmLoad - AI-Powered Package Installer

<div align="center">

![npmLoad Banner](https://img.shields.io/badge/npmLoad-AI%20Powered-blue?style=for-the-badge&logo=npm)

[![npm version](https://img.shields.io/npm/v/npmload-cli.svg?style=flat-square)](https://www.npmjs.com/package/npmload-cli)
[![npm downloads](https://img.shields.io/npm/dm/npmload-cli.svg?style=flat-square)](https://www.npmjs.com/package/npmload-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg?style=flat-square)](https://nodejs.org/)

**Streamline your development workflow with natural language package installation**

</div>

## Overview

npmLoad is an intelligent CLI tool that leverages Google's Gemini AI to understand your project requirements and automatically generate optimized installation commands. Simply describe your project needs in natural language, and npmLoad will determine the appropriate packages and configuration steps.

## Key Benefits

### AI-Powered Intelligence
- Natural language processing for project requirements
- Intelligent package recommendations based on use case
- Automated complex project setup and configuration

### Security and Reliability
- **Open Source**: Complete transparency with publicly available source code
- **Command Preview**: All commands are displayed before execution
- **User Authorization**: Explicit approval required for each operation
- **Free Gemini API**: Utilizes Google's complimentary AI service
- **Local Execution**: All operations performed on your local environment

### Enhanced Developer Experience
- Intelligent folder and project management
- Real-time installation progress tracking
- Persistent API key storage with one-time configuration
- Modern command-line interface

## Quick Start

### Installation

```bash
npm install -g npmload-cli
```

### Initial Setup

```bash
npmload
```

npmLoad will guide you through the initial configuration and API key setup process.

## How It Works

### 1. Project Configuration
```bash
npmload
# Specify target folder or use current directory
```

### 2. Requirement Specification
Describe your project needs in natural language:

```bash
✔ What do you want to install? › I want to build a Next.js app with authentication and MongoDB
```

### 3. AI Analysis and Command Generation
npmLoad processes your request and generates optimized installation commands:

```bash
Commands to run:
1. npx create-next-app@latest my-app --yes --use-npm
2. npm install next-auth mongoose axios dotenv
3. npx shadcn@latest init
```

### 4. Confirmation and Execution
Review and approve the generated commands:

```bash
✔ Proceed with installation? › Yes
```

## Use Cases

| Input Description | Generated Setup |
|------------------|-----------------|
| "install express and cors" | Express server with CORS middleware |
| "nextjs with tailwind and shadcn" | Next.js application with TailwindCSS and shadcn/ui |
| "build a React dashboard with charts" | React application with Chart.js and UI components |
| "typescript node API with database" | TypeScript Express server with database integration |
| "install shadcn button component" | shadcn/ui initialization with button component |

## Features

### User Interface
- Clean, modern command-line design
- Real-time progress indicators with step tracking
- Clear command preview and confirmation
- Structured output with visual separators

### Project Management
- Automatic folder creation and navigation
- Current directory installation support
- Complex project structure handling

### Progress Monitoring
- Sequential step tracking with counters
- Percentage-based completion indicators
- Live npm output display for transparency
- Clear visual separation between operations

### API Key Management
- Secure input handling with masked entry
- Global configuration storage
- One-time setup with persistent storage
- Automatic key validation

## Security and Privacy

### Security Features

1. **Complete Transparency**: All commands are displayed before execution
2. **User Authorization**: Explicit approval required for each installation step
3. **Local Execution**: All operations performed on your local machine
4. **Open Source**: Full code visibility and community review
5. **Free AI Service**: Utilizes Google's complimentary Gemini API
6. **Secure Storage**: API keys stored locally with no external transmission

### Security Guarantees

npmLoad is designed with security as a primary concern:

- Never executes commands without explicit user permission
- Does not transmit project files to external servers
- Only installs verified packages from official repositories
- Does not modify files without user visibility and approval
- Operates without requiring paid subscriptions or premium services

## Installation Methods

### Global Installation (Recommended)
```bash
npm install -g npmload-cli
npmload
```

### Single Use
```bash
npx npmload-cli
```

### Local Installation
```bash
npm install npmload-cli
npx npmload
```

## Requirements

- **Node.js**: Version 18.0.0 or higher
- **npm**: Latest stable version recommended
- **Gemini API Key**: Available free from Google AI Studio

## API Key Configuration

### Obtaining Your API Key
1. Navigate to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a free Google account if needed
3. Generate a new API key
4. Launch `npmload` and enter your key when prompted

### Environment Variable Setup
```bash
# Add to your .env file
GEMINI_API_KEY=your_api_key_here

# Or configure globally
export GEMINI_API_KEY=your_api_key_here
```

## Advanced Usage

### Custom Project Configuration
```bash
npmload
✔ Enter folder name: my-project-name
✔ What do you want to install: full-stack application with React and Node.js
```

### Individual Package Installation
```bash
npmload
✔ Enter folder name: .
✔ What do you want to install: lodash and axios utilities
```

### Framework-Specific Configuration
```bash
# Next.js with comprehensive tooling
"nextjs with typescript, tailwind, shadcn, and authentication"

# Express API development
"express server with cors, helmet, and mongodb integration"

# React dashboard development
"react dashboard with routing and data visualization"
```

## Contributing

We welcome contributions from the development community. Here are ways to contribute:

1. **Bug Reports**: Submit issues via [GitHub Issues](https://github.com/vaibhavgupta5/npmload/issues)
2. **Feature Requests**: Propose new features through [GitHub Issues](https://github.com/vaibhavgupta5/npmload/issues)
3. **Pull Requests**: Fork the repository, implement changes, and submit pull requests
4. **Documentation**: Help improve documentation and examples

### Development Environment
```bash
git clone https://github.com/vaibhavgupta5/npmload.git
cd npmload
npm install
npm link
```

## Author

**Vaibhav Gupta** - [@vaibhavgupta5](https://github.com/vaibhavgupta5)

---

<div align="center">

### Support the Project

If npmLoad improves your development workflow, please consider giving it a star on [GitHub](https://github.com/vaibhavgupta5/npmload).

**Built for developers, by developers**

</div>

---

## Additional Examples

<details>
<summary>View more usage examples</summary>

### Web Development
```bash
# Modern React application
"react app with vite, tailwind, and react-router"

# Vue.js project setup
"vue 3 project with composition api and pinia"

# Angular application
"angular app with material design"
```

### Backend Development
```bash
# REST API development
"express rest api with jwt authentication"

# GraphQL server setup
"apollo graphql server with mongodb"

# Microservices architecture
"fastify microservice with redis caching"
```

### Full-Stack Development
```bash
# MERN Stack
"full mern stack with authentication"

# T3 Stack configuration
"nextjs with trpc, prisma, and nextauth"

# Serverless functions
"serverless functions with vercel"
```

### Development Tools
```bash
# CLI tool development
"commander.js cli with inquirer"

# Testing framework setup
"jest and testing-library setup"

# Build tool configuration
"webpack with babel and css modules"
```

</details>

---

*Professional package management made simple.*