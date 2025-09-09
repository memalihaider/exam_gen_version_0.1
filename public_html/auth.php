<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Database connection
$host = "edu.largifysolutions.com";
$dbname = "u421900954_ecompapgen";
$username = "u421900954_PaperGenerator";
$password = "PaperGeneratorByAhmad786";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(['success' => false, 'error' => 'Connection failed: ' . $e->getMessage()]));
}

// Handle the request
$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

switch($action) {
    case 'login':
        handleLogin($pdo, $data);
        break;
    case 'createUser':
        handleCreateUser($pdo, $data);
        break;
    case 'getUserInfo':
        handleGetUserInfo($pdo, $data);
        break;
    case 'getAllUsers':
        handleGetAllUsers($pdo);
        break;
    case 'updateUser':
        handleUpdateUser($pdo, $data);
        break;
    case 'deleteUser':
        handleDeleteUser($pdo, $data);
        break;
    case 'getSystemStats':
        handleGetSystemStats($pdo);
        break;
    default:
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
}

function handleLogin($pdo, $data) {
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        // Remove password from response
        unset($user['password']);
        // Make sure role is included in the response
        echo json_encode(['success' => true, 'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'status' => $user['status'],
            'schoolName' => $user['school_name'],
            'package' => $user['package'],
            'expiryDate' => $user['expiry_date']
        ]]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
    }
}

function handleCreateUser($pdo, $data) {
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $role = $data['role'] ?? 'user';
    $package = $data['package'] ?? 'basic';
    $expiryDate = $data['expiryDate'] ?? '';
    $schoolName = $data['schoolName'] ?? '';
    $status = $data['status'] ?? 'active';

    try {
        // Check if email already exists
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetchColumn() > 0) {
            throw new Exception('Email already exists');
        }

        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, package, expiry_date, school_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $name,
            $email,
            password_hash($password, PASSWORD_DEFAULT),
            $role,
            $package,
            $expiryDate,
            $schoolName,
            $status
        ]);
        
        echo json_encode(['success' => true, 'message' => 'User created successfully']);
    } catch(Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

function handleGetUserInfo($pdo, $data) {
    $email = $data['email'] ?? '';
    
    $stmt = $pdo->prepare("SELECT id, name, email, role, package, expiry_date, school_name, status FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'error' => 'User not found']);
    }
}

function handleGetAllUsers($pdo) {
    try {
        $stmt = $pdo->query("SELECT id, name, email, role, package, expiry_date, school_name, status FROM users ORDER BY created_at DESC");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'users' => $users]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Failed to fetch users']);
    }
}

function handleUpdateUser($pdo, $data) {
    try {
        $userId = $data['id'] ?? '';
        if (!$userId) {
            throw new Exception('User ID is required');
        }

        $fields = [
            'name' => $data['name'] ?? null,
            'email' => $data['email'] ?? null,
            'role' => $data['role'] ?? null,
            'package' => $data['package'] ?? null,
            'expiry_date' => $data['expiryDate'] ?? null,
            'school_name' => $data['schoolName'] ?? null,
            'status' => $data['status'] ?? null
        ];

        // Remove null values
        $fields = array_filter($fields, function($value) {
            return $value !== null;
        });

        if (empty($fields)) {
            throw new Exception('No fields to update');
        }

        // Build the SQL query
        $sql = "UPDATE users SET ";
        $updates = [];
        $values = [];
        foreach ($fields as $key => $value) {
            $updates[] = "$key = ?";
            $values[] = $value;
        }
        $sql .= implode(', ', $updates);
        $sql .= " WHERE id = ?";
        $values[] = $userId;

        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);
        
        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
    } catch(Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

function handleDeleteUser($pdo, $data) {
    try {
        $userId = $data['userId'] ?? '';
        if (!$userId) {
            throw new Exception('User ID is required');
        }

        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        
        echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
    } catch(Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

function handleGetSystemStats($pdo) {
    try {
        // Get total users
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM users");
        $totalUsers = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

        // Get active users
        $stmt = $pdo->query("SELECT COUNT(*) as active FROM users WHERE status = 'active'");
        $activeUsers = $stmt->fetch(PDO::FETCH_ASSOC)['active'];

        // Get papers stats
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM papers");
        $totalPapers = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

        $stats = [
            'users' => [
                'total' => $totalUsers,
                'active' => $activeUsers
            ],
            'papers' => [
                'total' => $totalPapers
            ],
            'system' => [
                'status' => 'operational',
                'lastUpdate' => date('Y-m-d H:i:s')
            ]
        ];

        echo json_encode(['success' => true, 'stats' => $stats]);
    } catch(Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Failed to fetch system stats']);
    }
}
?>