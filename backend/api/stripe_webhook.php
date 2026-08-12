<?php
require_once __DIR__ . "/db.php";
require_once __DIR__ . "/../stripe/init.php";

\Stripe\Stripe::setApiKey("sk_test_51TQm3H73DiIxIHwL7pb1JxnxHm6vuYre2v7mGrmKqMb7A8UaHhZ3dfbPMyEs59L42JA5YAVOlSAMw742mRmjBYpO00bykgToEN");

$endpoint_secret = "whsec_NmVhSEmHSTVtVm55niOyTZulVoMiPc1c";

$payload = @file_get_contents("php://input");
$sig_header = $_SERVER["HTTP_STRIPE_SIGNATURE"] ?? "";

try {
    $event = \Stripe\Webhook::constructEvent(
        $payload,
        $sig_header,
        $endpoint_secret
    );
} catch (Exception $e) {
    http_response_code(400);
    exit("Invalid webhook");
}

if ($event->type === "checkout.session.completed") {
    $session = $event->data->object;

    $order_id = isset($session->metadata->order_id)
        ? (int)$session->metadata->order_id
        : 0;

    $payment_reference = $session->id;

    if ($order_id > 0) {
        $stmt = $conn->prepare("
            UPDATE certificate_orders
            SET payment_status = 'paid',
                payment_reference = ?,
                paid_at = NOW()
            WHERE id = ?
              AND payment_status = 'pending'
        ");

        $stmt->bind_param("si", $payment_reference, $order_id);
        $stmt->execute();
    }
}

http_response_code(200);
echo "ok";
?>