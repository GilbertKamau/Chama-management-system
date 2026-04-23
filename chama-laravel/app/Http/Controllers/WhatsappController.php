<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Loan;
use App\Models\Contribution;
use App\Services\GeminiAiService;
use App\Services\SmsService;
use App\Services\MpesaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class WhatsappController extends Controller
{
    protected $aiService;
    protected $smsService;
    protected $mpesaService;

    public function __construct(GeminiAiService $aiService, SmsService $smsService, MpesaService $mpesaService)
    {
        $this->aiService    = $aiService;
        $this->smsService   = $smsService;
        $this->mpesaService = $mpesaService;
    }

    /**
     * Africa's Talking / Twilio Webhook
     */
    public function handle(Request $request)
    {
        $from = $request->get('from'); // User's phone number
        $text = $request->get('text');
        $mediaUrl = $request->get('mediaUrl'); // For voice notes

        if (!$from) return response()->json(['status' => 'ignored'], 200);

        // Find user
        $cleanPhone = preg_replace('/^\+/', '', $from);
        $user = User::where('phone_number', $cleanPhone)->first();

        if (!$user) {
            $this->smsService->sendWhatsapp($from, "Karibu! Your number is not registered. Please register on the Chama app first.");
            return response()->json(['status' => 'unregistered']);
        }

        // Handle Confirmation Logic
        if (Cache::has("pending_action_$cleanPhone") && in_array(strtolower(trim($text)), ['yes', 'ndio', 'sawa', 'ok'])) {
            return $this->executePendingAction($user, $from, $cleanPhone);
        }

        // Parse Intent (Text or Voice)
        if ($mediaUrl) {
            $audioBase64 = base64_encode(Http::get($mediaUrl)->body());
            $intent = $this->aiService->parseIntent($audioBase64, true);
        } else {
            $intent = $this->aiService->parseIntent($text);
        }

        return $this->processIntent($user, $from, $cleanPhone, $intent);
    }

    protected function processIntent($user, $from, $phone, $intent)
    {
        $action = $intent['action'] ?? 'unknown';
        $amount = $intent['amount'] ?? null;
        $msg    = $intent['message'] ?? "Sikuelewa vizuri. Jaribu tena?";

        switch ($action) {
            case 'balance':
                $total = Contribution::where('user_id', $user->id)->sum('amount');
                $pool  = Contribution::where('chama_id', $user->chama_id)->where('status', 'approved')->sum('amount');
                $reply = "Salio lako ni KES " . number_format($total) . ".\nJumla ya kikundi (Pool) ni KES " . number_format($pool) . ".";
                $this->smsService->sendWhatsapp($from, $reply);
                break;

            case 'pay':
                if (!$amount) {
                    $this->smsService->sendWhatsapp($from, "Unataka kulipa kiasi gani? (e.g. Lipa 500)");
                    break;
                }
                Cache::put("pending_action_$phone", ['action' => 'pay', 'amount' => $amount], 120);
                $this->smsService->sendWhatsapp($from, "Nimeelewa unataka kulipa KES " . number_format($amount) . ". Je, niendelee? (Jibu YES au NDIO)");
                break;

            case 'loan':
                if (!$amount) {
                    $this->smsService->sendWhatsapp($from, "Unataka mkopo wa kiasi gani? (e.g. Nataka mkopo wa 1000)");
                    break;
                }
                Cache::put("pending_action_$phone", ['action' => 'loan', 'amount' => $amount, 'duration' => $intent['duration'] ?? 3], 120);
                $this->smsService->sendWhatsapp($from, "Nimeelewa unataka mkopo wa KES " . number_format($amount) . ". Je, niendelee? (Jibu YES au NDIO)");
                break;

            case 'info':
                $this->smsService->sendWhatsapp($from, "Karibu kwenye Chama Bot! Unaweza kuangalia salio, kulipa mchango, au kuomba mkopo kwa kutuma ujumbe wa sauti au maandishi.");
                break;

            default:
                $this->smsService->sendWhatsapp($from, $msg);
        }

        return response()->json(['status' => 'processed']);
    }

    protected function executePendingAction($user, $from, $phone)
    {
        $pending = Cache::pull("pending_action_$phone");
        $action  = $pending['action'];
        $amount  = $pending['amount'];

        if ($action === 'pay') {
            $chama = $user->chama;
            $callbackUrl = env('MPESA_CALLBACK_URL') . "/api/mpesa/callback?chama_id=" . $chama->id . "&user_id=" . $user->id;
            $this->mpesaService->initiateStkPush($chama, $amount, $phone, $callbackUrl);
            $this->smsService->sendWhatsapp($from, "Ombi la M-Pesa la KES $amount limetumwa kwenye simu yako. Tafadhali ingiza PIN.");
        } 
        elseif ($action === 'loan') {
            Loan::create([
                'user_id'          => $user->id,
                'chama_id'         => $user->chama_id,
                'amount'           => $amount,
                'payment_duration' => $pending['duration'] ?? 3,
                'mobile_number'    => $phone,
                'status'           => 'Pending',
                'loan_date'        => now(),
            ]);
            $this->smsService->sendWhatsapp($from, "Ombi lako la mkopo wa KES $amount limepokelewa na linashugulikiwa na Admin.");
        }

        return response()->json(['status' => 'executed']);
    }

    /**
     * Web App Voice Command
     */
    public function handleVoice(Request $request)
    {
        $request->validate(['audio' => 'required|string']);
        $intent = $this->aiService->parseIntent($request->audio, true);
        return response()->json($intent);
    }
}
