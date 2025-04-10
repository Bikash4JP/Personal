<?php
// Set headers first
header('Content-Type: text/html; charset=utf-8');

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo '<div class="error-message">このページは直接アクセスできません。</div>';
    exit;
}

// Process the form data
$name = htmlspecialchars($_POST['name'] ?? '', ENT_QUOTES, 'UTF-8');
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
// [Add all other field processing...]

// Validate required fields
$errors = [];
if (empty($name)) $errors[] = '氏名が入力されていません';
// [Add other validations...]

if (!empty($errors)) {
    http_response_code(400);
    echo '<div class="error-message"><ul>';
    foreach ($errors as $error) {
        echo '<li>' . htmlspecialchars($error, ENT_QUOTES, 'UTF-8') . '</li>';
    }
    echo '</ul><p><a href="../inquiry.html">戻る</a></p></div>';
    exit;
}

// Send email (using PHPMailer is recommended for production)
$to = 'ueda@it-future.jp';
$subject = "【お問い合わせ】{$company} - {$name}様";
$message = "【お問い合わせ内容】\n\n";
$message .= "氏名: {$name}\n";
$message .= "会社名: {$company}\n";
// [Add all other fields...]

$headers = "From: {$email}\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $message, $headers)) {
    // Success response
    echo '<!DOCTYPE html>
    <html>
    <head>
        <title>送信完了</title>
        <link rel="stylesheet" href="../css/style.css">
        <meta http-equiv="refresh" content="5;url=../index.html">
    </head>
    <body>
        <div class="container">
            <div class="success-message">
                <h3>送信が完了しました</h3>
                <p>当社の代表者が折り返しご連絡いたしますので、少々お待ちください。</p>
                <p>5秒後にトップページに自動的に戻ります。</p>
            </div>
        </div>
    </body>
    </html>';
} else {
    http_response_code(500);
    echo '<div class="error-message">メールの送信に失敗しました。もう一度お試しください。</div>';
}