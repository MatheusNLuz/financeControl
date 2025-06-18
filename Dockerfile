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

# 5. Cria usuário appuser para rodar composer e dar permissão
RUN groupadd -g 1000 appuser && useradd -u 1000 -g appuser -m appuser

# 6. Define diretório de trabalho
WORKDIR /var/www/html

# 7. Copia todo o código da aplicação (incluindo artisan)
COPY . .

# 8. Ajusta permissões para usuário appuser
RUN chown -R appuser:appuser /var/www/html

# 9. Muda para usuário não-root para rodar composer
USER appuser

# 10. Instala dependências PHP do Laravel (como appuser)
RUN composer install --no-dev --optimize-autoloader

# 11. Volta para root para continuar a build
USER root

# 12. Instala dependências do Node e compila os assets com Vite
RUN npm install --omit=dev && npm run build

# 13. Ajusta permissões para storage e cache (para www-data)
RUN chown -R www-data:www-data storage bootstrap/cache

# 14. Copia configuração do Nginx customizada
COPY ./docker/nginx.conf /etc/nginx/sites-available/default

# 15. Copia configuração do Supervisor para rodar nginx + php-fpm
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# 16. Copia script deploy que roda migrate, seed e inicia supervisord
COPY deploy.sh /usr/local/bin/deploy.sh
RUN chmod +x /usr/local/bin/deploy.sh

# 17. Expõe a porta HTTP usada no container
EXPOSE 80

# 18. Comando padrão para iniciar o container (executa deploy.sh)
CMD ["/usr/local/bin/deploy.sh"]
