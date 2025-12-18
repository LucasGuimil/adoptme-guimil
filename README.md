# 🐾 AdoptMe - Backend API

API RESTful desarrollada para la gestión de adopción de mascotas, usuarios y autenticación segura. Este proyecto sirve como backend para una plataforma de adopciones.

![NodeJS](https://img.shields.io/badge/Node.js-22.11.0-green)
![Docker](https://img.shields.io/badge/Docker-Image-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

## 🐳 Docker Hub

La imagen oficial de este proyecto está disponible en Docker Hub. 
🔗 **Link al repositorio:** [lucasguimil/adoptme-guimil](https://hub.docker.com/r/lucasguimil/adoptme-guimil)

### Ejecutar con Docker

Para correr la última versión de la imagen:

#### 1. Descargar la imagen
```docker pull lucasguimil/adoptme-guimil```

#### 2. Correr el contenedor (inyectando variables de entorno)
```docker run -p 8080:8080 --env-file ./.env.production lucasguimil/adoptme-guimil```

###🛠️ Tecnologías Utilizadas
- Runtime: Node.js
- Framework: Express.js
- Base de Datos: MongoDB (Mongoose)
- Autenticación: JSON Web Tokens (JWT) & Cookies
- Contenerización: Docker
- Testing: Jest & Supertest

###🚀 Instalación Local
Si prefieres correr el proyecto localmente para desarrollo:
1. Clonar el repositorio:
```
git clone https://github.com/LucasGuimil/adoptme-guimil
cd RecursosBackend-Adoptme
```
2. Instalar dependencias:
```npm install```

3. Configurar variables de entorno:
Crea un archivo .env (o .env.production) en la raíz con las siguientes variables:
```
PORT=8080
MONGO_URL=tu_url_de_mongo
JWT_SECRET=tokenSecretJW
COOKIE_NAME=cookieName
```
Iniciar el servidor:

```
# Modo desarrollo (con nodemon si está configurado)
npm run dev

# Modo producción
npm start
```
🧪 Testing

El proyecto cuenta con tests de integración y unitarios.

```npm test```