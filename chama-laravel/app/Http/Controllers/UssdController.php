<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\Loan;
use App\Models\User;
use App\Services\GeminiAiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UssdController extends Controller
{
    protected $aiService;

    public function __construct(GeminiAiService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function handle(Request $request)
    {
        $phoneNumber = $request->get('phoneNumber');
        $text        = $request->get('text', '');

        // Africa's Talking sends text as 1*2*3...
        $input = ($text === "") ? [] : explode("*", $text);
        $level = count($input);

        // Find user
        $user = User::where('phone_number', $phoneNumber)->first();

        if (!$user) {
            return $this->respond("END Karibu / Welcome to Chama.\nUnregistered number: $phoneNumber\nPlease register via the App.");
        }

        // 1. Language Selection (Step 0)
        if ($level === 0) {
            return $this->respond("CON Karibu {$user->email}\nChagua lugha / Choose language:\n1. English\n2. Kiswahili");
        }

        $lang = ($input[0] === '2') ? 'sw' : 'en';

        // 2. PIN Setup Flow (For new users)
        if (!$user->has_set_pin) {
            return $this->handlePinSetup($input, $level, $user, $lang);
        }

        // 3. PIN Authentication Flow
        // Every session must start with PIN entry at level 1
        if ($level === 1) {
            return $this->respond($lang === 'sw' ? "CON Ingiza PIN yako ya siri:" : "CON Enter your secret USSD PIN:");
        }

        // Verify PIN (Step 2)
        if (!Hash::check($input[1], $user->ussd_pin)) {
            return $this->respond("END " . ($lang === 'sw' ? "PIN si sahihi. Jaribu tena." : "Incorrect PIN. Try again."));
        }

        // 4. Main Menu (Level 2)
        if ($level === 2) {
            return $this->showMainMenu($lang);
        }

        // 5. Menu Logic (Level 3+)
        return $this->handleMenuNavigation($input, $level, $user, $lang);
    }

    private function handlePinSetup(array $input, int $level, User $user, string $lang): \Illuminate\Http\Response
    {
        // level 1: prompt for new pin
        if ($level === 1) {
            return $this->respond($lang === 'sw' ? "CON Unda PIN mpya ya siri (tarakimu 4):" : "CON Create a new secret PIN (4 digits):");
        }
        // level 2: confirm pin
        if ($level === 2) {
            return $this->respond($lang === 'sw' ? "CON Rudia PIN yako:" : "CON Confirm your new PIN:");
        }
        // level 3: save and finish
        if ($level === 3) {
            if ($input[1] !== $input[2] || strlen($input[1]) !== 4) {
                return $this->respond("END " . ($lang === 'sw' ? "PIN hazifanani au ni fupi mno. Jaribu tena." : "PINs don't match or invalid length. Try again."));
            }
            $user->update([
                'ussd_pin'    => Hash::make($input[1]),
                'has_set_pin' => true
            ]);
            return $this->respond("END " . ($lang === 'sw' ? "PIN imehifadhiwa! Tafadhali piga tena ili kuanza." : "PIN set successfully! Please dial again to start."));
        }
        return $this->respond("END Error.");
    }

    private function showMainMenu(string $lang): \Illuminate\Http\Response
    {
        $menu = ($lang === 'sw') 
            ? "CON Menyu:\n1. Salio\n2. Rekodi ya Michango\n3. Omba Mkopo\n4. Hali ya Mkopo"
            : "CON Menu:\n1. Balance\n2. Contribution History\n3. Request Loan\n4. Loan Status";
        return $this->respond($menu);
    }

    private function handleMenuNavigation(array $input, int $level, User $user, string $lang): \Illuminate\Http\Response
    {
        $choice = $input[2]; // Choice made at Level 2

        switch ($choice) {
            case '1': // Balance
                return $this->respond("END " . $this->getBalanceLine($user, $lang));

            case '2': // History
                return $this->respond("END " . $this->getContributionHistory($user, $lang));

            case '3': // Request Loan
                if ($level === 3) {
                    return $this->respond($lang === 'sw' ? "CON Ingiza kiasi cha mkopo:" : "CON Enter loan amount:");
                }
                if ($level === 4) {
                    $amount = (float) $input[3];
                    
                    // AI Validation Step
                    $chama   = $user->chama;
                    $pdfPath = $chama ? $chama->constitution_pdf_path : null;
                    
                    $aiResult = $this->aiService->validateTransaction(
                        'loan', 
                        $amount, 
                        now()->toDateString(), 
                        $pdfPath
                    );

                    Loan::create([
                        'user_id'          => $user->id,
                        'chama_id'         => $user->chama_id,
                        'amount'           => $amount,
                        'payment_duration' => 3, // Default for USSD requests
                        'mobile_number'    => $user->phone_number,
                        'status'           => ($aiResult['status'] === 'flagged') ? 'flagged' : 'Pending',
                        'flag_reason'      => $aiResult['reason'] ?? null,
                        'loan_date'        => now(),
                    ]);

                    $msg = ($lang === 'sw')
                        ? "Maombi ya KES " . number_format($amount) . " yamepokelewa. Hali: " . $aiResult['status']
                        : "Request for KES " . number_format($amount) . " received. Status: " . $aiResult['status'];
                    
                    return $this->respond("END " . $msg);
                }
                break;

            case '4': // Loan Status
                return $this->respond("END " . $this->getLoanStatus($user, $lang));
        }

        return $this->respond("END " . ($lang === 'sw' ? "Chaguo si sahihi." : "Invalid selection."));
    }

    private function getBalanceLine(User $user, string $lang): string
    {
        $total = Contribution::where('user_id', $user->id)->sum('amount');
        $formatted = 'KES ' . number_format($total, 2);
        return ($lang === 'sw') ? "Jumla ya michango: $formatted" : "Total contributions: $formatted";
    }

    private function getContributionHistory(User $user, string $lang): string
    {
        $contributions = Contribution::where('user_id', $user->id)->orderByDesc('created_at')->limit(3)->get();
        if ($contributions->isEmpty()) return ($lang === 'sw') ? "Hakuna michango bado." : "No contributions found.";
        
        return $contributions->map(fn($c) => "KES " . number_format($c->amount) . " (" . $c->created_at->format('d/m') . ")")->implode("\n");
    }

    private function getLoanStatus(User $user, string $lang): string
    {
        $loan = Loan::where('user_id', $user->id)->orderByDesc('created_at')->first();
        if (!$loan) return ($lang === 'sw') ? "Huna mkopo." : "No active loan.";
        
        $msg = ($lang === 'sw') 
            ? "Mkopo: KES " . number_format($loan->amount) . "\nHali: " . $loan->status
            : "Loan: KES " . number_format($loan->amount) . "\nStatus: " . $loan->status;
        
        if ($loan->status === 'flagged') {
            $msg .= "\nReason: " . ($loan->flag_reason ?? 'AI flagged');
        }
        return $msg;
    }

    private function respond(string $text): \Illuminate\Http\Response
    {
        return response($text, 200)->header('Content-Type', 'text/plain');
    }
}
