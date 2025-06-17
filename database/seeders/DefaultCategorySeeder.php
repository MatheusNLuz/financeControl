<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class DefaultCategorySeeder extends Seeder
{
    public function run()
    {
        $categoriasReceita = [
            ['name' => 'Salário', 'icon' => 'Briefcase'],
            ['name' => 'Criptomoeda', 'icon' => 'Bitcoin'],
            ['name' => 'Fundo Imobiliário', 'icon' => 'Landmark'],
            ['name' => 'Pix/TED', 'icon' => 'Banknote'],
            ['name' => 'Outros', 'icon' => 'MessageCircleMore'],
        ];

        $categoriasDespesa = [
            ['name' => 'Alimentação', 'icon' => 'ShoppingBasket'],
            ['name' => 'Moradia', 'icon' => 'Home'],
            ['name' => 'Transporte', 'icon' => 'Car'],
            ['name' => 'Lazer', 'icon' => 'Gamepad2'],
            ['name' => 'Contas domésticas', 'icon' => 'ReceiptText'],
            ['name' => 'Internet', 'icon' => 'Wifi'],
            ['name' => 'Seguro', 'icon' => 'ShieldCheck'],
            ['name' => 'Saúde', 'icon' => 'HeartPulse'],
            ['name' => 'Educação', 'icon' => 'BookOpenText'],
            ['name' => 'Criptomoeda', 'icon' => 'Bitcoin'],
            ['name' => 'Fundo Imobiliário', 'icon' => 'Landmark'],
            ['name' => 'Pix/TED', 'icon' => 'Banknote'],
            ['name' => 'Outros', 'icon' => 'MessageCircleMore'],
        ];

        foreach ($categoriasReceita as $categoria) {
            Category::create([
                'name' => $categoria['name'],
                'type' => 'receita',
                'icon' => $categoria['icon'],
            ]);
        }

        foreach ($categoriasDespesa as $categoria) {
            Category::create([
                'name' => $categoria['name'],
                'type' => 'despesa',
                'icon' => $categoria['icon'],
            ]);
        }
    }
}
