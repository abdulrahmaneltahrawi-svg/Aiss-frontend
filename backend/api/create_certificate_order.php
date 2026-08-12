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

$first_name = isset($_POST["first_name"]) ? trim($_POST["first_name"]) : "";
$last_name = isset($_POST["last_name"]) ? trim($_POST["last_name"]) : "";
$company_name = isset($_POST["company_name"]) ? trim($_POST["company_name"]) : "";
$country = isset($_POST["country"]) ? trim($_POST["country"]) : "";
$phone = isset($_POST["phone"]) ? trim($_POST["phone"]) : "";
$email = isset($_POST["email"]) ? trim($_POST["email"]) : "";
$notes = isset($_POST["notes"]) ? trim($_POST["notes"]) : "";
$certificate_type = isset($_POST["certificate_type"]) ? (int)$_POST["certificate_type"] : 0;

if ($first_name === "") respond(false, "First name is required");
if ($last_name === "") respond(false, "Last name is required");
if ($country === "") respond(false, "Country is required");
if ($phone === "") respond(false, "Phone is required");
if ($email === "") respond(false, "Email is required");

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, "Invalid email");
}

if ($certificate_type === 1) {
    $certificate_name = "شهادة مدرب معتمد";
    $amount = 735.00;
} elseif ($certificate_type === 2) {
    $certificate_name = "شهادة مركز معتمد";
    $amount = 1469.00;
} else {
    respond(false, "Invalid certificate type");
}

$stmt = $conn->prepare("
    INSERT INTO certificate_orders
    (
        first_name,
        last_name,
        company_name,
        country,
        phone,
        email,
        notes,
        certificate_type,
        certificate_name,
        amount,
        payment_status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
");

if (!$stmt) {
    respond(false, "Server error");
}

$stmt->bind_param(
    "sssssssisd",
    $first_name,
    $last_name,
    $company_name,
    $country,
    $phone,
    $email,
    $notes,
    $certificate_type,
    $certificate_name,
    $amount
);

if ($stmt->execute()) {
    respond(true, "Certificate order created successfully", [
        "order_id" => $stmt->insert_id,
        "certificate_name" => $certificate_name,
        "amount" => $amount,
        "payment_status" => "pending"
    ]);
} else {
    respond(false, "Failed to create certificate order");
}
?>