<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Services\GeminiAiService;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoanController extends Controller
{
    protected $aiService;
    protected $smsService;

    public function __construct(GeminiAiService $aiService, SmsService $smsService)
    {
        $this->aiService = $aiService;
        $this->smsService = $smsService;
    }

    public function index()
    {
        return response()->json(Loan::with('user')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric',
            'payment_duration' => 'required|integer',
            'mobile_number' => 'required',
        ]);

        $user = Auth::user();
        $chama = $user->chama;
        $pdfPath = $chama ? $chama->constitution_pdf_path : null;

        // AI Validation for Loan
        $aiResult = $this->aiService->validateTransaction(
            'loan', 
            $request->amount, 
            now()->toDateString(), 
            $pdfPath
        );

        $loan = Loan::create([
            'user_id' => $user->id,
            'chama_id' => $user->chama_id,
            'amount' => $request->amount,
            'payment_duration' => $request->payment_duration,
            'mobile_number' => $request->mobile_number,
            'status' => ($aiResult['status'] === 'flagged') ? 'flagged' : 'Pending',
            'flag_reason' => $aiResult['reason'] ?? null,
            'loan_date' => now(),
        ]);

        return response()->json([
            'message' => 'Loan request submitted successfully',
            'data' => $loan,
            'ai_flagged' => ($aiResult['status'] === 'flagged'),
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $loan = Loan::with('user')->findOrFail($id);
        $loan->update(['status' => $request->status]);

        // Notify user of the final decision
        if ($loan->user && $loan->user->phone_number) {
            $msg = ($request->status === 'Approved') 
                ? "Maombi yako ya mkopo wa KES " . number_format($loan->amount) . " YAMEKUBALIWA. Tafadhali subiri fedha kwenye simu yako."
                : "Maombi yako ya mkopo wa KES " . number_format($loan->amount) . " YAMEKATALIWA. Tafadhali wasiliana na admin kwa maelezo zaidi.";
            
            $this->smsService->send($loan->user->phone_number, $msg);
        }

        return response()->json(['message' => 'Loan status updated and user notified.']);
    }
}
