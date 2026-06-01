# imagen de Node.js 
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de dependencias 
COPY package*.json ./

# Instalamos todas las dependencias
RUN npm install

# Copiamos el resto del código del proyecto al contenedor
COPY . .

# Puerto que usa nuestra API 
ENV PORT=3000
EXPOSE PORT

# Comando para arrancar el servidor
CMD ["npm", "run", "start"]