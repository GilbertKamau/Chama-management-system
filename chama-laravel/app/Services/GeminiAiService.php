<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class GeminiAiService
{
    protected $apiKey;
    protected $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY');
    }

    public function validateTransaction($type, $amount, $date, $constitutionPath)
    {
        if (empty($this->apiKey)) {
            return ['status' => 'approved', 'reason' => 'AI validation skipped: API Key missing'];
        }

        $rulesText = $this->extractConstitutionText($constitutionPath);

        $prompt = "You are an automated Chama (community savings group) compliance officer.
        Analyze if this transaction complies with the group's rules extracted from their constitution.

        Transaction Details:
        - Type: $type
        - Amount: $amount
        - Date: $date

        Compliance Rules extracted from Constitution:
        \"\"\"
        $rulesText
        \"\"\"

        Check for:
        1. Maximum loan limits (if any).
        2. Contribution frequency or minimums.
        3. Any other relevant restrictions.

        Response format (strict JSON only):
        {
          \"status\": \"approved\" | \"flagged\",
          \"reason\": \"... explain why if flagged, or why approved if there was a doubt ...\"
        }";

        try {
            $response = Http::post($this->apiUrl . "?key=" . $this->apiKey, [
                "contents" => [
                    [
                        "parts" => [
                            ["text" => $prompt]
                        ]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $aiText = $response->json('candidates.0.content.parts.0.text');
                $aiText = str_replace(['```json', '```'], '', $aiText);
                return json_decode(trim($aiText), true) ?? ['status' => 'approved', 'reason' => 'AI response parsing error'];
            }
        } catch (\Exception $e) {
            Log::error("Gemini AI validation failed: " . $e->getMessage());
        }

        return ['status' => 'approved', 'reason' => 'AI validation unreachable'];
    }

    public function parseIntent($input, $isAudio = false)
    {
        if (empty($this->apiKey)) {
            return ['action' => 'unknown', 'message' => 'AI intent parsing skipped: API Key missing'];
        }

        $parts = [];
        if ($isAudio) {
            $parts[] = [
                "inline_data" => [
                    "mime_type" => "audio/mp3", // Assuming mp3/ogg from WhatsApp/Web
                    "data" => $input
                ]
            ];
        } else {
            $parts[] = ["text" => $input];
        }

        $prompt = "You are a specialized Chama (community savings) assistant. 
        Your task is to extract the user's intent from the provided text or audio. 
        The language may be English or Kiswahili (Swahili).
        
        Extract the following fields in strict JSON format:
        - action: 'balance' | 'pay' | 'loan' | 'info' | 'unknown'
        - amount: (integer) the money amount mentioned, or null
        - duration: (integer) months for loan requests, or null
        - message: (string) a short, friendly Swahili translation of what you understood
        
        Intent Mapping Examples:
        - 'Salio langu?' -> {action: 'balance'}
        - 'Lipa mchango wa mia tano' -> {action: 'pay', amount: 500}
        - 'Nataka mkopo wa elfu kumi' -> {action: 'loan', amount: 10000}
        
        Response format (strict JSON only):
        {
          \"action\": \"...\",
          \"amount\": ...,
          \"duration\": ...,
          \"message\": \"...\"
        }";

        $parts[] = ["text" => $prompt];

        try {
            $response = Http::post($this->apiUrl . "?key=" . $this->apiKey, [
                "contents" => [
                    [
                        "parts" => $parts
                    ]
                ]
            ]);

            if ($response->successful()) {
                $aiText = $response->json('candidates.0.content.parts.0.text');
                $aiText = str_replace(['```json', '```'], '', $aiText);
                return json_decode(trim($aiText), true) ?? ['action' => 'unknown', 'message' => 'Parsing error'];
            }
        } catch (\Exception $e) {
            Log::error("Gemini Intent parsing failed: " . $e->getMessage());
        }

        return ['action' => 'unknown', 'message' => 'AI service unreachable'];
    }

    protected function extractConstitutionText($path)
    {
        if (!$path || !Storage::disk('local')->exists($path)) {
            return "No constitution rules found. Defaulting to general Chama principles.";
        }

        try {
            $fullPath = storage_path('app/' . $path);
            
            // Check if Smalot\PdfParser is available
            if (class_exists(\Smalot\PdfParser\Parser::class)) {
                $parser = new \Smalot\PdfParser\Parser();
                $pdf    = $parser->parseFile($fullPath);
                return substr($pdf->getText(), 0, 10000); // Limit to first 10k chars to avoid token limits
            }
            
            return "PDF parser library not installed. Please run 'composer require smalot/pdfparser'.";
        } catch (\Exception $e) {
            Log::warning("Could not extract PDF text: " . $e->getMessage());
            return "Rule extraction failed. Please check the PDF format.";
        }
    }
}
