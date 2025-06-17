# 1. Imagem base PHP com FPM
FROM php:8.2-fpm

# 2. Instala dependências do sistema e pacotes necessários
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git curl npm supervisor nginx \
    libonig-dev libxml2-dev libpng-dev libjpeg-dev libfreetype6-dev libpq-dev \
 && apt-get clean

# 3. Instala extensões PHP necessárias (inclui apenas Postgres)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install pdo pdo_pgsql zip gd bcmath mbstring xml

# 4. Instala Composer (copiado da imagem oficial)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Define diretório de trabalho
WORKDIR /var/www/html

# 6. Copia apenas arquivos do Composer para instalar dependências em cache
COPY composer.json composer.lock ./

# 7. Instala dependências PHP do Laravel
RUN composer install --no-dev --optimize-autoloader

# 8. Copia todo o restante do código da aplicação
COPY . .

# 9. Instala dependências do Node e compila os assets com Vite
RUN npm install && npm run build

# 10. Ajusta permissões para storage e cache
RUN chown -R www-data:www-data storage bootstrap/cache

# 11. Copia configuração do Nginx customizada
COPY ./docker/nginx.conf /etc/nginx/sites-available/default

# 12. Copia configuração do Supervisor para rodar nginx + php-fpm
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# 13. Expõe a porta HTTP usada no container
EXPOSE 80

# 14. Comando padrão para iniciar nginx + php-fpm usando Supervisor
CMD ["supervisord", "-n"]
