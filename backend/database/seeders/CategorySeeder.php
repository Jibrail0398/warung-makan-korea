<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'id' => 1,
                'name' => 'Makanan Utama',
                'slug' => 'makanan-utama',
            ],
            [
                'id' => 2,
                'name' => 'Korean Street Food',
                'slug' => 'korean-street-food',
            ],
            [
                'id' => 3,
                'name' => 'Sup & Jjigae',
                'slug' => 'sup-jjigae',
            ],
            [
                'id' => 4,
                'name' => 'Banchan & Side Dish',
                'slug' => 'banchan-side-dish',
            ],
            [
                'id' => 5,
                'name' => 'Minuman',
                'slug' => 'minuman',
            ],
            [
                'id' => 6,
                'name' => 'Dessert',
                'slug' => 'dessert',
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::updateOrCreate(
                ['id' => $categoryData['id']],
                [
                    'name' => $categoryData['name'],
                    'slug' => $categoryData['slug'],
                ]
            );
        }
    }
}
