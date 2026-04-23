# Chama Management System (AI-Powered)

An advanced, production-ready platform designed to digitize and secure Chama (informal investment group) operations. This system combines Modern Web tools with USSD Accessibility and Gemini AI for automated compliance and risk management.

---

## Key Features

*   AI Compliance Engine: Uses Google Gemini to automatically validate loan requests and contributions against the group's PDF constitution.
*   USSD Integration: Secure 4-digit PIN-based access for feature-phone users, allowing them to make contributions and request loans via shortcode.
*   Bilingual Support: The entire platform (Web and USSD) is fully navigable in both English and Kiswahili.
*   Transparency Dashboard: Real-time group metrics showing Total Pool, Disbursed Loans, and Available Funds to all members.
*   Multi-Tenant Isolation: Robust architectural isolation ensuring each Chama's data remains strictly private.
*   Automated SMS Alerts: Real-time notifications via Africa's Talking for loan approvals, rejections, and contribution receipts.

---

## Technology Stack

*   Backend: Laravel 10 (PHP 8.2) + PostgreSQL
*   Frontend: React (Vite) + Vanilla CSS (Forest Green Theme)
*   AI: Google Gemini Pro (via google/generative-ai)
*   USSD/SMS: Africa's Talking API
*   Orchestration: Docker & Docker Compose

---

## Getting Started

### Prerequisites
*   Docker & Docker Compose
*   A Google Gemini API Key
*   Africa's Talking Credentials (for USSD/SMS)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd Chama-management-system
    ```

2.  Configure Environment:
    Create a .env file in chama-laravel/ by copying .env.example. Ensure you set the following:
    ```env
    GEMINI_API_KEY=your_key_here
    AFRICAS_TALKING_USERNAME=your_username
    AFRICAS_TALKING_API_KEY=your_api_key
    MPESA_CALLBACK_URL=https://your-ngrok-url.ngrok-free.app
    ```

3.  Launch with Docker:
    From the root directory, run:
    ```bash
    docker-compose up -d --build
    ```

4.  Run Migrations:
    ```bash
    docker-compose exec backend php artisan migrate
    ```

Note: For M-Pesa STK Push callbacks to work during local development, you must start Ngrok on port 8000 and update the MPESA_CALLBACK_URL in your .env.

The system will be available at:
*   Frontend: http://localhost:3000
*   API: http://localhost:8000/api

---

## Usage Guide

### For Administrators
*   Bank & M-Pesa Settings: Configure your group's bank account and M-Pesa Daraja credentials (Shortcode, Consumer Key, Secret, Passkey) in the Settings tab.
*   Upload Constitution: Upload your group's PDF constitution. The AI will use this to learn your rules automatically.
*   Member Management: Add or remove members and assign roles.
*   Loan Review: Review loans flagged by AI. You have the final say on all transactions.

### For Members
*   Contribute: Make contributions via the Web App or USSD.
*   Request Loans: Apply for loans and track status in real-time.
*   Group View: Stay updated on the total group savings pool for 100% transparency.

---

## Project Structure

```text
.
├── chama/               # React Frontend
├── chama-laravel/       # Laravel API Backend
├── docker-compose.yml   # Orchestration
└── .gitignore           # Global exclusion rules
```

---

## Security

*   USSD PINs: Mandatory 4-digit hashed PINs for all mobile transactions.
*   Data Scoping: Every query is scoped to the user's chama_id at the database layer.
*   Sanctum Auth: Secure token-based authentication for all API requests.

---

## Support
For any questions regarding the Africa's Talking integration or Gemini AI prompts, please contact the development team.
