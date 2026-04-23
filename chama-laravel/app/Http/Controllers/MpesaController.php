<?php

namespace App\Http\Controllers;

use App\Models\Chama;
use App\Models\Payment;
use App\Models\User;
use App\Services\MpesaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MpesaController extends Controller
{
    protected $mpesaService;

    public function __construct(MpesaService $mpesaService)
    {
        $this->mpesaService = $mpesaService;
    }

    /**
     * Initiate STK Push from the frontend.
     */
    public function initiateStkPush(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'phone'  => 'required|string',
        ]);

        $user  = auth()->user();
        $chama = $user->chama;

        if (!$chama || !$chama->mpesa_shortcode) {
            return response()->json(['message' => 'M-Pesa not configured for this Chama'], 400);
        }

        // Clean phone number (2547XXXXXXXX)
        $phone = preg_replace('/^0/', '254', $request->phone);
        if (!str_starts_with($phone, '254')) $phone = '254' . $phone;

        $callbackUrl = env('MPESA_CALLBACK_URL') . "/api/mpesa/callback?chama_id=" . $chama->id . "&user_id=" . $user->id;

        $result = $this->mpesaService->initiateStkPush($chama, $request->amount, $phone, $callbackUrl);

        return response()->json($result);
    }

    /**
     * Handle Callback from Safaricom.
     */
    public function callback(Request $request)
    {
        $payload = $request->all();
        Log::info("M-Pesa Callback received", $payload);

        $chamaId = $request->get('chama_id');
        $userId  = $request->get('user_id');

        $stkCallback = $payload['Body']['stkCallback'] ?? null;
        if (!$stkCallback) return response()->json(['status' => 'error'], 400);

        $resultCode = $stkCallback['ResultCode'];
        
        if ($resultCode === 0) {
            // Success
            $meta = $stkCallback['CallbackMetadata']['Item'];
            $amount    = $this->getMetaValue($meta, 'Amount');
            $reference = $this->getMetaValue($meta, 'MpesaReceiptNumber');

            Payment::create([
                'user_id'           => $userId,
                'chama_id'          => $chamaId,
                'amount'            => $amount,
                'payment_reference' => $reference,
                'mobile_number'     => $this->getMetaValue($meta, 'PhoneNumber') ?? 'N/A',
                'status'            => 'approved',
            ]);

            return response()->json(['status' => 'success']);
        }

        Log::warning("STK Push failed for User $userId", $payload);
        return response()->json(['status' => 'failed']);
    }

    private function getMetaValue($meta, $name)
    {
        foreach ($meta as $item) {
            if ($item['Name'] === $name) return $item['Value'] ?? null;
        }
        return null;
    }
}
