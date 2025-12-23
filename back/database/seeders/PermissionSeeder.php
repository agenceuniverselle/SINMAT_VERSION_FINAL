<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        // Modules à gérer
        $modules = [
            'Utilisateurs'        => 'users',
            'Produits'            => 'products',
            'Catégories'          => 'categories',
            'Catégories Location' => 'rental_categories',
            'Produits Location'   => 'rental_products',
            'Blog'                => 'blog',
            'Newsletters'         => 'newsletters',
            'Messages de contact' => 'contact_messages',
            'Permissions'         => 'permissions',
        ];

        // Actions standards
        $actions = [
            'Voir'     => 'view',
            'Créer'    => 'create',
            'Modifier' => 'edit',
            'Supprimer'=> 'delete',
        ];

        foreach ($modules as $label => $codeBase) {
            foreach ($actions as $actionLabel => $actionCode) {
                Permission::firstOrCreate([
                    'name'     => "$actionLabel $label",
                    'code'     => "{$actionCode}_{$codeBase}",
                    'category' => $label,
                ]);
            }
        }
    }
}
