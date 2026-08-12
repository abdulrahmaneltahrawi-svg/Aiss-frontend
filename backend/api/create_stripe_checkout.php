<?php
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/db.php";
require_once __DIR__ . "/../stripe/init.php";

\Stripe\Stripe::setApiKey("sk_test_51TQm3H73DiIxIHwL7pb1JxnxHm6vuYre2v7mGrmKqMb7A8UaHhZ3dfbPMyEs59L42JA5YAVOlSAMw742mRmjBYpO00bykgToEN");

function respond($success, $message, $extra = []) {
    echo json_encode(array_merge([
        "success" => $success,
        "message" => $message
    ], $extra), JSON_UNESCAPED_UNICODE);
    exit;
}

$order_id = isset($_POST["order_id"]) ? (int)$_POST["order_id"] : 0;

if ($order_id <= 0) {
    respond(false, "Invalid order id");
}

$stmt = $conn->prepare("
    SELECT id, first_name, last_name, email, certificate_name, amount, payment_status
    FROM certificate_orders
    WHERE id = ?
    LIMIT 1
");

if (!$stmt) {
    respond(false, "Server error");
}

$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    respond(false, "Order not found");
}

$order = $result->fetch_assoc();

if ($order["payment_status"] !== "pending") {
    respond(false, "Order already processed");
}

try {
    $session = \Stripe\Checkout\Session::create([
        "payment_method_types" => ["card"],
        "mode" => "payment",

        "customer_email" => $order["email"],

        "line_items" => [[
            "price_data" => [
                "currency" => "aed",
                "product_data" => [
                    "name" => $order["certificate_name"],
                ],
                "unit_amount" => (int) round($order["amount"] * 100),
            ],
            "quantity" => 1,
        ]],

        // "success_url" => "http://localhost/aiss/payment-success.html?order_id=" . $order_id,
        // "cancel_url" => "http://localhost/aiss/payment-cancel.html?order_id=" . $order_id,
        
        "success_url" => "https://aiss.co/payment-success.html?order_id=" . $order_id,
        "cancel_url" => "https://aiss.co/payment-cancel.html?order_id=" . $order_id,

        "metadata" => [
            "order_id" => $order_id
        ]
    ]);

    respond(true, "Checkout session created", [
        "checkout_url" => $session->url,
        "stripe_session_id" => $session->id
    ]);

} catch (Exception $e) {
    respond(false, $e->getMessage());
}
?>