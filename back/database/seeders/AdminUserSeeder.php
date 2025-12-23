<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'contact@sinmat.ma'],
            [
                'name' => 'Super Admin',
                'phone' => '+212 666565325',
                'email' => 'contact@sinmat.ma',
                'password' => Hash::make('Super-admin@Sinmat2025'), // mot de passe sécurisé
                'remember_token' => Str::random(60),
            ]
        );
    }
}
