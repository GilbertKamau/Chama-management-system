<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Services\GeminiAiService;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContributionController extends Controller
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
        // Eloquent multi-tenancy trait (BelongsToChama) handles filtering
        return response()->json(Contribution::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric',
        ]);

        $user = Auth::user();
        $chama = $user->chama;
        $pdfPath = $chama ? $chama->constitution_pdf_path : null;

        // Perform AI Validation
        $aiResult = $this->aiService->validateTransaction(
            'contribution', 
            $request->amount, 
            now()->toDateTimeString(), 
            $pdfPath
        );

        $status = $aiResult['status'] ?? 'approved';

        $contribution = Contribution::create([
            'user_id' => $user->id,
            'chama_id' => $user->chama_id,
            'amount' => $request->amount,
            'description' => $request->description,
            'status' => $status,
            'flag_reason' => $aiResult['reason'] ?? null,
        ]);

        // Only notify immediately if it is approved
        if ($status === 'approved' && $user->phone_number) {
            $this->smsService->send(
                $user->phone_number,
                "Hongera! Mchango wako wa KES " . number_format($request->amount) . " umepokelewa kikamilifu. Ahsante."
            );
        }

        return response()->json([
            'message' => 'Contribution recorded successfully',
            'data' => $contribution
        ]);
    }
}
