<?php

namespace App\Services;

use App\Models\Chama;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MpesaService
{
    protected $baseUrl = "https://sandbox.safaricom.co.ke"; // Change to production URL when live

    public function getAccessToken(Chama $chama)
    {
        $consumerKey = $chama->mpesa_consumer_key;
        $consumerSecret = $chama->mpesa_consumer_secret;

        if (!$consumerKey || !$consumerSecret) {
            return null;
        }

        $credentials = base64_encode($consumerKey . ":" . $consumerSecret);

        $response = Http::withHeaders([
            'Authorization' => 'Basic ' . $credentials,
        ])->get($this->baseUrl . "/oauth/v1/generate?grant_type=client_credentials");

        if ($response->successful()) {
            return $response->json()['access_token'];
        }

        Log::error("M-Pesa auth failed for Chama ID: " . $chama->id . " Response: " . $response->body());
        return null;
    }

    public function initiateStkPush(Chama $chama, $amount, $phoneNumber, $callbackUrl)
    {
        $token = $this->getAccessToken($chama);
        if (!$token) return ['status' => 'error', 'message' => 'Invalid M-Pesa credentials.'];

        $timestamp = now()->format('YmdHis');
        $shortCode = $chama->mpesa_shortcode;
        $passkey   = $chama->mpesa_passkey;

        $password = base64_encode($shortCode . $passkey . $timestamp);

        $response = Http::withToken($token)->post($this->baseUrl . "/mpesa/stkpush/v1/processrequest", [
            'BusinessShortCode' => $shortCode,
            'Password'          => $password,
            'Timestamp'         => $timestamp,
            'TransactionType'   => 'CustomerPayBillOnline',
            'Amount'            => $amount,
            'PartyA'            => $phoneNumber,
            'PartyB'            => $shortCode,
            'PhoneNumber'       => $phoneNumber,
            'CallBackURL'       => $callbackUrl,
            'AccountReference'  => $chama->name,
            'TransactionDesc'   => 'Chama Deposit',
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        Log::error("STK Push failed for Chama ID: " . $chama->id . " Response: " . $response->body());
        return ['status' => 'error', 'message' => $response->json()['CustomerMessage'] ?? 'STK Push failed.'];
    }
}
