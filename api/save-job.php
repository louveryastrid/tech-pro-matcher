<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$user_id = intval($data['user_id'] ?? 0);
$job_id = htmlspecialchars($data['job_id'] ?? '');
$job_title = htmlspecialchars($data['job_title'] ?? '');
$company = htmlspecialchars($data['company'] ?? '');

if (!$user_id || !$job_id) {
    http_response_code(400);
    echo json_encode(['error' => 'User ID and Job ID required']);
    exit;
}

$stmt = $pdo->prepare('INSERT INTO saved_jobs (user_id, job_id, job_title, company) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE saved_at = NOW()');

try {
    $stmt->execute([$user_id, $job_id, $job_title, $company]);
    echo json_encode(['success' => true, 'message' => 'Job saved']);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save job']);
}
?>