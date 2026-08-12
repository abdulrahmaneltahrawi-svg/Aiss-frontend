<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
require_once __DIR__ . "/db.php";

function respond($success, $message, $extra = []) {
    echo json_encode(array_merge([
        "success" => $success,
        "message" => $message
    ], $extra), JSON_UNESCAPED_UNICODE);
    exit;
}

// ================= الكود =================
$code = isset($_GET["code"]) ? trim($_GET["code"]) : "";

if ($code === "") {
    respond(false, "يرجى إدخال كود الشهادة");
}

// ================= البحث =================
$stmt = $conn->prepare("SELECT * FROM certificates WHERE code = ? LIMIT 1");
$stmt->bind_param("s", $code);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    respond(false, "الكود غير صحيح أو غير موجود");
}

$cert = $result->fetch_assoc();

// ================= الحالة =================
$statusLabels = [
    "active"  => "سارية",
    "expired" => "منتهية الصلاحية",
    "revoked" => "ملغاة",
];

// ================= رابط الـ PDF =================


$protocol   = (!empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off") ? "https" : "http";
$base_url   = $protocol . "://" . $_SERVER["HTTP_HOST"];
// $script_dir = str_replace("\\", "/", dirname($_SERVER["SCRIPT_NAME"])); // /aiss/api
// $root_dir   = str_replace("/api", "", $script_dir);                      // /aiss
$script_dir = dirname($_SERVER["SCRIPT_NAME"]); // بيجيب /aiss/api
$root_dir   = preg_replace('/\/api$/', '', $script_dir); // بيشيل /api → /aiss
$file_url   = $base_url . $root_dir . "/assets/uploads/certifications/" . $cert["code"] . ".pdf";


respond(true, "تم التحقق من الشهادة", [
    "valid"        => $cert["status"] === "active",
    "code"         => $cert["code"],
    "type"         => $cert["type"],
    "holder_name"  => $cert["holder_name"],
    "issue_date"   => $cert["issue_date"],
    "expiry_date"  => $cert["expiry_date"],
    "status"       => $cert["status"],
    "status_label" => $statusLabels[$cert["status"]] ?? $cert["status"],
    "file_url"     => $file_url,
]);
