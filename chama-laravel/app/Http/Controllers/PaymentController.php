<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function index()
    {
        return response()->json(Payment::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric',
            'payment_reference' => 'required',
            'mobile_number' => 'required',
        ]);

        $user = Auth::user();

        $payment = Payment::create([
            'user_id' => $user->id,
            'chama_id' => $user->chama_id,
            'amount' => $request->amount,
            'payment_reference' => $request->payment_reference,
            'mobile_number' => $request->mobile_number,
            'status' => 'approved',
        ]);

        return response()->json([
            'message' => 'Payment recorded successfully',
            'data' => $payment
        ]);
    }
}
