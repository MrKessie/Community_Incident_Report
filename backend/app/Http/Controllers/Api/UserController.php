<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function maintenanceUsers(): JsonResponse
    {
        $users = User::whereHas('role', function ($query) {
            $query->where('role_name', 'Maintenance');
        })->select('id', 'name', 'email')->get();

        return response()->json([
            'data' => $users,
        ]);
    }
}
