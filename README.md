# DashboardCrypto

DashboardCrypto es una aplicación para administrar y ver el valor de criptomonedas en pesos argentinos.

## Requisitos

Asegúrate de tener instalados los siguientes programas:

- Docker
- Docker-compose
- Node.js
- TypeScript
- Angular CLI

## Pasos para levantar la aplicación

1. Clona el repositorio:
    ```bash
    git clone https://github.com/Faus14/DashboardCrypto.git
    ```

2. Navega al directorio del proyecto:
    ```bash
    cd DashboardCrypto
    ```

3. Levanta los contenedores de Docker:
    ```bash
    sudo docker-compose up -d
    ```

4. Instala las dependencias del frontend:
    ```bash
    cd crypto-frontend/
    npm install
    ```

5. Sirve la aplicación frontend:
    ```bash
    ng serve
    ```

6. En otra terminal, navega al directorio del backend:
    ```bash
    cd crypto-backend/
    npm install
    ```

7. Inicia la aplicación backend:
    ```bash
    npm run start
    ```

6. Ingresar con las credenciales:
    ```bash
    usuario: admin
    contraseña: admin
    ```

¡Y eso es todo! Ahora deberías poder ver y administrar tus criptomonedas en la aplicación.