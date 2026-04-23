<?php

namespace App\Http\Controllers;

use App\Models\Chama;
use App\Models\User;
use App\Models\Contribution;
use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ChamaController extends Controller
{
    /**
     * Super Admin: list all Chamas with member + transaction stats.
     */
    public function index()
    {
        $user = Auth::user();
        if ($user->role !== 'super_admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $chamas = Chama::withCount('users')->get()->map(function ($chama) {
            return [
                'id'                  => $chama->id,
                'name'                => $chama->name,
                'ai_analysis_status'  => $chama->ai_analysis_status,
                'member_count'        => $chama->users_count,
                'created_at'          => $chama->created_at,
            ];
        });

        $stats = [
            'total_chamas'  => Chama::count(),
            'total_users'   => User::count(),
            'total_loans'   => Loan::count(),
        ];

        return response()->json([
            'chamas' => $chamas,
            'stats'  => $stats,
        ]);
    }

    /**
     * Admin: upload a PDF constitution for the authenticated user's Chama.
     */
    public function uploadConstitution(Request $request)
    {
        $request->validate([
            'constitution' => 'required|file|mimes:pdf|max:10240', // max 10 MB
        ]);

        $user  = Auth::user();
        $chama = $user->chama;

        if (!$chama) {
            return response()->json(['message' => 'No Chama associated with your account'], 404);
        }

        // Delete old PDF if it exists
        if ($chama->constitution_pdf_path) {
            Storage::disk('local')->delete($chama->constitution_pdf_path);
        }

        $path = $request->file('constitution')->store('constitutions', 'local');

        $chama->update([
            'constitution_pdf_path' => $path,
            'ai_analysis_status'    => 'uploaded',
        ]);

        return response()->json([
            'message' => 'Constitution uploaded successfully. AI will now use this for future validations.',
            'path'    => $path,
        ]);
    }

    /**
     * Return the current Chama's details (for admin dashboard header).
     */
    public function show()
    {
        $user  = Auth::user();
        $chama = $user->chama;

        if (!$chama) {
            return response()->json(['message' => 'No Chama found'], 404);
        }

        return response()->json($chama);
    }

    /**
     * Admin: get report data (all payments and loans in this Chama).
     */
    public function reports()
    {
        $user = Auth::user();
        if (!in_array($user->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $payments = Contribution::with('user:id,email')->get();
        $loans    = Loan::with('user:id,email')->get();

        return response()->json([
            'payments' => $payments,
            'loans'    => $loans,
        ]);
    }

    /**
     * Admin: update Chama settings (Rules, Bank & M-Pesa).
     */
    public function updateSettings(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $chama = $user->chama;
        if (!$chama) return response()->json(['message' => 'Chama not found'], 404);

        $request->validate([
            'bank_name'             => 'nullable|string',
            'bank_account'          => 'nullable|string',
            'mpesa_shortcode'       => 'nullable|string',
            'mpesa_passkey'         => 'nullable|string',
            'mpesa_consumer_key'    => 'nullable|string',
            'mpesa_consumer_secret' => 'nullable|string',
            'contribution_amount'   => 'nullable|numeric',
            'contribution_frequency' => 'nullable|string',
            'contribution_day'      => 'nullable|string',
        ]);

        $chama->update($request->all());

        return response()->json(['message' => 'Settings updated successfully']);
    }

    /**
     * Any Member: get summary metrics for transparency.
     */
    public function summary()
    {
        $user = Auth::user();
        $chama = $user->chama;

        if (!$chama) return response()->json(['message' => 'No Chama found'], 404);

        $totalPool = Contribution::where('chama_id', $chama->id)
            ->where('status', 'approved')
            ->sum('amount');

        return response()->json([
            'group' => [
                'name' => $chama->name,
                'total_pool' => $totalPool,
                'member_count' => User::where('chama_id', $chama->id)->count(),
                'available_pool' => $totalPool - Loan::where('chama_id', $chama->id)->where('status', 'Approved')->sum('amount'),
                'contribution_amount' => $chama->contribution_amount,
                'contribution_frequency' => $chama->contribution_frequency,
                'contribution_day' => $chama->contribution_day,
                'has_onboarded' => $chama->has_onboarded,
                'pending_loan_count' => Loan::where('chama_id', $chama->id)->where('status', 'Pending')->count(),
                'overdue_count' => User::where('chama_id', $chama->id)
                    ->whereDoesntHave('contributions', function($q) {
                        $q->where('created_at', '>=', now()->subDays(30));
                    })->count(),
            ],
            'personal' => [
                'balance' => Contribution::where('user_id', $user->id)->where('status', 'approved')->sum('amount'),
                'pending_loans' => Loan::where('user_id', $user->id)->where('status', 'Pending')->count(),
                'role' => $user->role,
                'phone' => $user->phone_number
            ]
        ]);
    }
}
