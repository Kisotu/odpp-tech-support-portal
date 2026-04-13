<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@odpp.go.ke',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'department' => 'ICT',
            'phone' => '+254722000001',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'John Mwangi',
            'email' => 'ict1@odpp.go.ke',
            'password' => Hash::make('password'),
            'role' => 'ict_officer',
            'department' => 'ICT',
            'phone' => '+254722000002',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Jane Wanjiku',
            'email' => 'ict2@odpp.go.ke',
            'password' => Hash::make('password'),
            'role' => 'ict_officer',
            'department' => 'ICT',
            'phone' => '+254722000003',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Peter Ochieng',
            'email' => 'prosecutor@odpp.go.ke',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'department' => 'Criminal Division',
            'phone' => '+254722000004',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Mary Atieno',
            'email' => 'admin1@odpp.go.ke',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'department' => 'Administration',
            'phone' => '+254722000005',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'James Kamau',
            'email' => 'finance@odpp.go.ke',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'department' => 'Finance',
            'phone' => '+254722000006',
            'is_active' => true,
        ]);
    }
}
