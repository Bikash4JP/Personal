<?php
header('Content-Type: text/html; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect and sanitize form data
    $name = htmlspecialchars($_POST['name'] ?? '', ENT_QUOTES, 'UTF-8');
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars($_POST['phone'] ?? '', ENT_QUOTES, 'UTF-8');
    $company = htmlspecialchars($_POST['company'] ?? '', ENT_QUOTES, 'UTF-8');
    $inquiry = htmlspecialchars($_POST['inquiry'] ?? '', ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars($_POST['message'] ?? '', ENT_QUOTES, 'UTF-8');
    $agree_policy = isset($_POST['agree_policy']) ? '同意済み' : '未同意';

    // Validate required fields
    $errors = [];
    if (empty($name)) $errors[] = '氏名が入力されていません';
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = '有効なメールアドレスを入力してください';
    if (empty($company)) $errors[] = '会社名が入力されていません';
    if (empty($inquiry)) $errors[] = 'お問い合わせ内容を選択してください';
    if (!isset($_POST['agree_policy'])) $errors[] = 'プライバシーポリシーに同意してください';

    if (!empty($errors)) {
        echo '<div class="error-message"><ul>';
        foreach ($errors as $error) {
            echo '<li>' . htmlspecialchars($error, ENT_QUOTES, 'UTF-8') . '</li>';
        }
        echo '</ul><p><a href="javascript:history.back()">戻る</a></p></div>';
        exit;
    }

    // Email configuration
    $to = 'bikash4jp@gmail.com';
    $subject = "【お問い合わせ】{$company} - {$name}様";
    $headers = [
        'From' => $email,
        'Reply-To' => $email,
        'Content-Type' => 'text/html; charset=UTF-8',
        'X-Mailer' => 'PHP/' . phpversion()
    ];

    // Build email content
    $email_content = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <title>お問い合わせ内容</title>
        <style>
            body { font-family: 'Meiryo', 'Yu Gothic', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h2 { color: #1e50a2; border-bottom: 2px solid #1e50a2; padding-bottom: 5px; }
            .detail-item { margin-bottom: 15px; }
            .label { font-weight: bold; display: inline-block; width: 120px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <h2>お問い合わせ内容</h2>
            <div class='detail-item'><span class='label'>氏名:</span> {$name}</div>
            <div class='detail-item'><span class='label'>会社名:</span> {$company}</div>
            <div class='detail-item'><span class='label'>メールアドレス:</span> {$email}</div>
            <div class='detail-item'><span class='label'>電話番号:</span> {$phone}</div>
            <div class='detail-item'><span class='label'>お問い合わせ種類:</span> {$inquiry}</div>
            <div class='detail-item'><span class='label'>メッセージ:</span><br>" . nl2br($message) . "</div>
            <div class='detail-item'><span class='label'>ポリシー同意:</span> {$agree_policy}</div>
        </div>
    </body>
    </html>
    ";

    // Flatten headers for mail() function
    $headers_str = '';
    foreach ($headers as $key => $value) {
        $headers_str .= "$key: $value\r\n";
    }

    // Send email
    $mailSent = mail($to, $subject, $email_content, $headers_str);

    // Return response
    if ($mailSent) {
        echo '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
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
                    <p><a href="../index.html">すぐに戻る</a></p>
                </div>
            </div>
        </body>
        </html>
        ';
    } else {
        echo '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>送信エラー</title>
            <link rel="stylesheet" href="../css/style.css">
        </head>
        <body>
            <div class="container">
                <div class="error-message">
                    <h3>送信に失敗しました</h3>
                    <p>申し訳ございません、メールの送信に失敗しました。</p>
                    <p>もう一度お試しいただくか、直接 ueda@it-future.jp までご連絡ください。</p>
                    <p><a href="javascript:history.back()">戻る</a></p>
                </div>
            </div>
        </body>
        </html>
        ';
    }
} else {
    header('Location: ../index.html');
    exit;
}
?>