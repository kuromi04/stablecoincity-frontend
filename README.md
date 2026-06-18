<p align="center">
  <img src="public/logo.jpg" alt="SKILLcoin Logo" width="160" style="border-radius: 50%;" />
</p>

# 🌌 SKILLcoin — AI Agent Skills Marketplace

> **Desarrollado y optimizado en su totalidad por [kuromi04](https://github.com/kuromi04) desde un entorno móvil local con Termux (Android).**

SKILLcoin (stablecoinSkill) es un Marketplace descentralizado (dApp) desplegado en la blockchain de **TON (The Open Network)**. Está diseñado específicamente para permitir la compra, venta e intercambio de habilidades (scripts y configuraciones ejecutorias) de agentes de Inteligencia Artificial optimizados para ejecutarse en entornos locales y móviles como **Termux**.

---

## 🎨 Características Principales

- **Economía Blockchain (TON):**
  - **Tarifa de listado:** 0.01 TON fijos por publicación para evitar spam.
  - **Comisión de plataforma:** 5% deducido automáticamente de cada venta directa, enviado instantáneamente al contrato inteligente propietario.
  - **Pago directo al vendedor:** 95% de la transacción más el exceso de gas sobrante (`SendRemainingValue`) se envían de forma instantánea al vendedor.
- **Habilidades representadas como NFTs:** Cada habilidad/script cargado se acuña virtualmente y se asocia a una dirección única en la blockchain.
- **Descargas en Perfil:** Los scripts adquiridos quedan registrados de forma inmutable y pueden descargarse directamente a través del panel de perfil para su uso inmediato en Termux.
- **Diseño Cyber-Neon Glassmorphic:** Una interfaz visual premium ultra-moderna y adaptativa con menús estilo hamburguesa y barras de navegación optimizadas para dispositivos móviles.

---

## 🛠️ Stack Tecnológico

- **Contratos Inteligentes:** Tact Compiler (TON Blockchain).
- **Frontend Framework:** React 18, Vite, TypeScript.
- **Integración Web3:** TON Connect SDK (`@tonconnect/ui-react`, `@ton/core`).
- **Icons:** Lucide React.
- **Hosting:** GitHub Pages.

---

## 📥 Configuración y Ejecución Local

Si deseas correr este proyecto de forma local en tu máquina o directamente dentro de Termux:

### Requisitos Previos

- **NodeJS** v18 o superior.
- **Yarn** o **npm**.

### Pasos para Instalar y Correr

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/kuromi04/stablecoinSkill.git
   cd stablecoinSkill/frontend
   ```

2. **Instalar dependencias:**
   ```bash
   yarn install
   # o bien
   npm install
   ```

3. **Ejecutar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 🚀 Despliegue en GitHub Pages

El proyecto cuenta con integración de CI/CD mediante **GitHub Actions** para despliegue automatizado en GitHub Pages.

Cada push a la rama `main` compila y despliega la dApp en:
🔗 **[https://kuromi04.github.io/stablecoinSkill/](https://kuromi04.github.io/stablecoinSkill/)**

---

## 🔒 Contrato del Marketplace (Testnet)

El contrato inteligente de la plataforma ha sido compilado con **Tact** y desplegado en la Testnet de TON en la dirección:
`EQCxhChW7krycdlpFSncAD0ZH38nNABbuH_YorLdsjx6MnKm`

---

*Desarrollado con pasión desde un dispositivo móvil utilizando Termux, combinando el poder de la terminal de Linux con Web3.*
