<?php
// API endpoint for user signup
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
$password = $data['password'] ?? '';
$name = htmlspecialchars(trim($data['name'] ?? ''));

// Validation
if (!$email || strlen($password) < 8 || !$name) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input. Password must be 8+ characters.']);
    exit;
}

// Check if user already exists
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['error' => 'Email already registered']);
    exit;
}

// Create new user
$password_hash = password_hash($password, PASSWORD_BCRYPT);
$stmt = $pdo->prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)');

try {
    $stmt->execute([$email, $password_hash, $name]);
    $user_id = $pdo->lastInsertId();
    
    // Generate session token
    $token = bin2hex(random_bytes(32));
    
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user_id,
            'email' => $email,
            'name' => $name
        ],
        'token' => $token
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create user']);
}
?>