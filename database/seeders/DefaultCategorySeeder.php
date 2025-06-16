<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class DefaultCategorySeeder extends Seeder
{
    public function run()
    {
        $categoriasReceita = [
            'Salário', 'Criptomoeda', 'Fundo Imobiliário', 'Outros'
        ];

        $categoriasDespesa = [
            'Alimentação', 'Moradia', 'Transporte', 'Lazer',
            'Saúde', 'Educação', 'Criptomoeda', 'Fundo Imobiliário', 'Outros'
        ];

        foreach ($categoriasReceita as $nome) {
            Category::create([
                'name' => $nome,
                'type' => 'receita'
            ]);
        }

        foreach ($categoriasDespesa as $nome) {
            Category::create([
                'name' => $nome,
                'type' => 'despesa'
            ]);
        }
    }
}

