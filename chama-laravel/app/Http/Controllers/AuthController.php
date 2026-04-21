<?php

namespace App\Http\Controllers;

use App\Models\Chama;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:4',
        ]);

        $chamaId = null;
        $role = 'user';

        if ($request->chama_name) {
            $chama = Chama::create(['name' => $request->chama_name]);
            $chamaId = $chama->id;
            $role = 'admin';
        }

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $role,
            'chama_id' => $chamaId,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid login details'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    /**
     * Super Admin only: list all users across all Chamas.
     */
    public function listUsers()
    {
        if (!in_array(Auth::user()->role, ['super_admin', 'admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $query = User::with('chama:id,name');
        
        // If not super_admin, only show users from the same Chama
        if (Auth::user()->role !== 'super_admin') {
            $query->where('chama_id', Auth::user()->chama_id);
        }

        $users = $query->get(['id','email','phone_number','role','chama_id','created_at']);
        return response()->json($users);
    }

    /**
     * Admin: add a new member to their Chama.
     */
    public function addUser(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:4',
        ]);

        $admin = Auth::user();
        if ($admin->role !== 'admin') {
            return response()->json(['message' => 'Only group admins can add members'], 403);
        }

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'chama_id' => $admin->chama_id,
        ]);

        return response()->json([
            'message' => 'User added successfully',
            'user' => $user
        ]);
    }

    /**
     * Admin: remove a member from their Chama.
     */
    public function deleteUser($id)
    {
        $admin = Auth::user();
        $user = User::findOrFail($id);

        if ($admin->role !== 'admin' || $user->chama_id !== $admin->chama_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->id === $admin->id) {
            return response()->json(['message' => 'You cannot remove yourself'], 400);
        }

        $user->delete();

        return response()->json(['message' => 'User removed successfully']);
    }
}
