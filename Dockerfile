# imagen de Node.js 
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias 
COPY package*.json ./

# Instalamos todas las dependencias
RUN npm install

# Copiamos el resto del código del proyecto al contenedor
COPY . .

# Puerto que usa nuestra API 
EXPOSE 3000

# Comando para arrancar el servidor
CMD ["npm", "start"]