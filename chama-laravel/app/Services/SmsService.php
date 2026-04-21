<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    protected $username;
    protected $apiKey;
    protected $apiUrl = "https://api.africastalking.com/version1/messaging";

    public function __construct()
    {
        $this->username = env('AFRICAS_TALKING_USERNAME');
        $this->apiKey   = env('AFRICAS_TALKING_API_KEY');
    }

    /**
     * Send an SMS message.
     */
    public function send($to, $message)
    {
        if (empty($this->apiKey) || empty($this->username)) {
            Log::info("SMS SIMULATION to $to: $message");
            return ['status' => 'simulated', 'message' => 'API keys missing, message logged.'];
        }

        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'apikey' => $this->apiKey,
            ])->asForm()->post($this->apiUrl, [
                'username' => $this->username,
                'to'       => $to,
                'message'  => $message,
            ]);

            if ($response->successful()) {
                Log::info("SMS SENT to $to: $message");
                return $response->json();
            }

            Log::error("SMS FAILED to $to: " . $response->body());
        } catch (\Exception $e) {
            Log::error("SMS EXCEPTION: " . $e->getMessage());
        }

        return ['status' => 'failed'];
    }
}
