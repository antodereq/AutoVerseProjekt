<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . "/vendor/autoload.php";

function envValue($key)
{
    static $env = null;

    if ($env === null) {
        $envPath = __DIR__ . "/.env";

        if (!file_exists($envPath)) {
            throw new Exception("Brak pliku .env w folderze backend.");
        }

        $env = parse_ini_file($envPath);
    }

    return $env[$key] ?? null;
}

function sendVerificationMail($toEmail, $toLogin, $verificationLink)
{
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host = envValue("SMTP_HOST");
    $mail->SMTPAuth = true;
    $mail->Username = envValue("SMTP_USERNAME");
    $mail->Password = envValue("SMTP_PASSWORD");
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = (int) envValue("SMTP_PORT");
    $mail->CharSet = "UTF-8";

    $mail->setFrom(
        envValue("SMTP_FROM_EMAIL"),
        envValue("SMTP_FROM_NAME")
    );

    $mail->addAddress($toEmail, $toLogin);

    $safeLogin = htmlspecialchars($toLogin, ENT_QUOTES, "UTF-8");
    $safeLink = htmlspecialchars($verificationLink, ENT_QUOTES, "UTF-8");

    $mail->isHTML(true);
    $mail->Subject = "Potwierdzenie konta AutoVerse";

    $mail->Body = "
        <h2>Witaj, {$safeLogin}!</h2>
        <p>Dziękujemy za rejestrację w AutoVerse.</p>
        <p>Kliknij poniższy przycisk, aby potwierdzić konto:</p>

        <p>
            <a href='{$safeLink}'
               style='display:inline-block;padding:14px 22px;background:#ff6b00;color:white;text-decoration:none;border-radius:10px;font-weight:bold;'>
                Potwierdź konto
            </a>
        </p>

        <p>Link jest ważny przez 24 godziny.</p>
        <p>Jeśli to nie Ty zakładałeś konto, zignoruj tę wiadomość.</p>
    ";

    $mail->AltBody = "Witaj, {$toLogin}! Potwierdź konto AutoVerse: {$verificationLink}";

    return $mail->send();
}