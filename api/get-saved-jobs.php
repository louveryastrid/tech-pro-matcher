<?php
require_once 'db.php';

$user_id = intval($_GET['user_id'] ?? 0);

if (!$user_id) {
    http_response_code(400);
    echo json_encode(['error' => 'User ID required']);
    exit;
}

$stmt = $pdo->prepare('SELECT job_id, job_title, company, saved_at FROM saved_jobs WHERE user_id = ? ORDER BY saved_at DESC');
$stmt->execute([$user_id]);
$jobs = $stmt->fetchAll();

echo json_encode([
    'success' => true,
    'saved_jobs' => $jobs
]);
?>