# imagem base com PHP + Composer + Node
FROM php:8.2-fpm

# Instala dependências básicas do sistema
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git curl npm

# Instala extensões PHP necessárias
RUN docker-php-ext-install pdo pdo_mysql zip

# Instala Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configura diretório de trabalho
WORKDIR /var/www/html

# Copia os arquivos da aplicação
COPY . .

# Instala dependências PHP
RUN composer install --no-dev --optimize-autoloader

# Instala dependências Node e builda assets (Vite)
RUN npm install && npm run build

# Exponha a porta
EXPOSE 9000

# Comando para iniciar o servidor
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=9000"]
