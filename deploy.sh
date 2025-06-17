php artisan migrate --force
php artisan db:seed --class=DefaultCategorySeeder --force
supervisord -n
