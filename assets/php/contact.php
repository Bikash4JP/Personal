<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and validate inputs
    $name = filter_var(trim($_POST["name"]), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = filter_var(trim($_POST["message"]), FILTER_SANITIZE_STRING);

    if (!empty($name) && !empty($email) && !empty($message) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $to = 'bikash4jp@gmail.com';
        $subject = 'New message from contact form';
        $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";

        if (mail($to, $subject, $body, $headers)) {
            echo "Thank you for your message. It has been sent.";
        } else {
            echo "There was an error sending your message. Please try again.";
        }
    } else {
        echo "Please fill in all fields correctly.";
    }
} else {
    echo "Invalid request method.";
}
?>
