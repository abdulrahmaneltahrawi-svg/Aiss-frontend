<?php
header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . "/db.php";

function respond($success, $message, $extra = []) {
    echo json_encode(array_merge([
        "success" => $success,
        "message" => $message
    ], $extra), JSON_UNESCAPED_UNICODE);
    exit;
}

$order_id = isset($_GET["order_id"]) ? (int)$_GET["order_id"] : 0;

if ($order_id <= 0) {
    respond(false, "Invalid order id");
}

$stmt = $conn->prepare("
    SELECT 
        id,
        first_name,
        last_name,
        email,
        certificate_name,
        amount,
        payment_status,
        payment_reference,
        created_at,
        paid_at
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

respond(true, "Order fetched successfully", [
    "order" => $order
]);
?>