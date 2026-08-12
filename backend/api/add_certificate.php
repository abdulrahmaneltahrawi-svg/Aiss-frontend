<?php
ini_set('session.use_strict_mode', 1);

session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'domain'   => '',
    'secure'   => false, // خليها true في production مع HTTPS
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start();

header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . "/db.php";

function respond($success, $message, $extra = []) {
    echo json_encode(array_merge([
        "success" => $success,
        "message" => $message
    ], $extra), JSON_UNESCAPED_UNICODE);
    exit;
}

function savePdf($fileKey, $code) {
    if (!isset($_FILES[$fileKey]) || $_FILES[$fileKey]["error"] !== 0) {
        return [false, "PDF upload failed"];
    }

    $uploadDir = dirname(__DIR__) . "/assets/uploads/certifications/";

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $tmpPath  = $_FILES[$fileKey]["tmp_name"];
    $ext      = strtolower(pathinfo($_FILES[$fileKey]["name"], PATHINFO_EXTENSION));

    if ($ext !== "pdf") {
        return [false, "يُسمح فقط بملفات PDF"];
    }

    $fileName   = $code . ".pdf";
    $targetPath = $uploadDir . $fileName;

    if (!move_uploaded_file($tmpPath, $targetPath)) {
        return [false, "فشل حفظ الملف"];
    }

    return [true, "uploads/certifications/" . $fileName];
}

// ================= الصلاحية =================
if (!isset($_SESSION["user_id"])) {
    respond(false, "Unauthorized");
}

$user_id = (int) $_SESSION["user_id"];

$permissionStmt = $conn->prepare("SELECT can_add_article FROM users WHERE id = ?");
if (!$permissionStmt) {
    respond(false, "Server error");
}

$permissionStmt->bind_param("i", $user_id);
$permissionStmt->execute();
$permissionResult = $permissionStmt->get_result();

if ($permissionResult->num_rows === 0) {
    respond(false, "User not found");
}

$user = $permissionResult->fetch_assoc();

if ((int)$user["can_add_article"] !== 1) {
    respond(false, "Not allowed");
}

// ================= البيانات =================
$code        = isset($_POST["code"])        ? trim($_POST["code"])        : "";
$type        = isset($_POST["type"])        ? trim($_POST["type"])        : "";
$holder_name = isset($_POST["holder_name"]) ? trim($_POST["holder_name"]) : "";
$issue_date  = isset($_POST["issue_date"])  ? trim($_POST["issue_date"])  : "";
$expiry_date = isset($_POST["expiry_date"]) ? trim($_POST["expiry_date"]) : null;
$status      = isset($_POST["status"])      ? trim($_POST["status"])      : "active";

// ================= Validation =================
if ($code === "")        respond(false, "كود الشهادة مطلوب");
if ($type === "")        respond(false, "نوع الشهادة مطلوب");
if ($holder_name === "") respond(false, "اسم الحاصل على الشهادة مطلوب");
if ($issue_date === "")  respond(false, "تاريخ الإصدار مطلوب");

$allowed_types = ["خبير معتمد", "مركز معتمد", "برنامج معتمد"];
if (!in_array($type, $allowed_types)) {
    respond(false, "نوع الشهادة غير صحيح");
}

$allowed_statuses = ["active", "expired", "revoked"];
if (!in_array($status, $allowed_statuses)) {
    respond(false, "حالة الشهادة غير صحيحة");
}

// ================= منع التكرار =================
$checkStmt = $conn->prepare("SELECT id FROM certificates WHERE code = ?");
if (!$checkStmt) {
    respond(false, "Server error");
}

$checkStmt->bind_param("s", $code);
$checkStmt->execute();
if ($checkStmt->get_result()->num_rows > 0) {
    respond(false, "الكود موجود بالفعل");
}

// ================= رفع الـ PDF =================
list($pdfOk, $pdfResult) = savePdf("pdf", $code);
if (!$pdfOk) {
    respond(false, $pdfResult);
}
$pdfPath = $pdfResult;

// ================= الحفظ في الداتابيز =================
$expiry_final = ($expiry_date === "" || $expiry_date === null) ? null : $expiry_date;

$stmt = $conn->prepare("
    INSERT INTO certificates (code, type, holder_name, issue_date, expiry_date, status)
    VALUES (?, ?, ?, ?, ?, ?)
");

if (!$stmt) {
    unlink(dirname(__DIR__) . "/" . $pdfPath);
    respond(false, "Server error");
}

$stmt->bind_param("ssssss", $code, $type, $holder_name, $issue_date, $expiry_final, $status);

if ($stmt->execute()) {
    respond(true, "تمت إضافة الشهادة بنجاح", [
        "certificate_id" => $stmt->insert_id,
        "code"           => $code,
    ]);
} else {
    unlink(dirname(__DIR__) . "/" . $pdfPath);
    respond(false, "فشل حفظ الشهادة");
}
