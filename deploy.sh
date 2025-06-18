# Roda as migrations com --force para não pedir confirmação
php artisan migrate --force

# Roda o seeder que desejar
php artisan db:seed --class=DefaultCategorySeeder --force

# Finalmente, inicia o supervisor no foreground para manter o container rodando
exec /usr/bin/supervisord -n


echo "==== Supervisord log ===="
cat /var/log/supervisor/supervisord.log || echo "No supervisord log"

echo "==== PHP-FPM status ===="
ps aux | grep php-fpm

echo "==== NGINX status ===="
ps aux | grep nginx
