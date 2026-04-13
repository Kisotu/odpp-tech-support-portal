<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['admin', 'ict_officer'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = User::query();

        if ($request->has('role') && $request->role !== '') {
            $query->where('role', $request->role);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = max(1, min((int) $request->input('per_page', 15), 100));
        $users = $query->orderBy('name')->paginate($perPage);

        return response()->json([
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    public function ictOfficers(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['admin', 'ict_officer'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $officers = User::where('role', 'ict_officer')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'department']);

        return response()->json([
            'data' => $officers,
        ]);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();

        if (!in_array($user->role, ['admin', 'ict_officer'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $targetUser = User::findOrFail($id);

        return response()->json([
            'data' => $targetUser,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'sometimes|string|max:20',
            'department' => 'sometimes|string|max:100',
            'role' => 'required|in:staff,ict_officer,admin',
            'is_active' => 'sometimes|boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['is_active'] = $validated['is_active'] ?? true;

        $newUser = User::create($validated);

        return response()->json([
            'message' => 'User created successfully',
            'data' => $newUser,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $targetUser = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8',
            'phone' => 'sometimes|string|max:20',
            'department' => 'sometimes|string|max:100',
            'role' => 'sometimes|in:staff,ict_officer,admin',
            'is_active' => 'sometimes|boolean',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $targetUser->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $targetUser->fresh(),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $targetUser = User::findOrFail($id);

        if ($targetUser->id === $user->id) {
            return response()->json([
                'message' => 'Cannot delete your own account',
            ], 422);
        }

        $targetUser->update(['is_active' => false]);

        return response()->json([
            'message' => 'User deactivated successfully',
        ]);
    }
}