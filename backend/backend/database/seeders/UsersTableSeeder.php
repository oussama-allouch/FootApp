<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'email_verified_at' => Carbon::now(),
            'password' => Hash::make('password123'), // Mot de passe crypté
            'role' => 'user', // Rôle défini à 'user'
            'remember_token' => Str::random(60), // Générer un token aléatoire
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
}
