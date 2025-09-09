<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, Origin');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

header('Content-Type: application/json; charset=UTF-8');

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
    case 'getAllTeachers':
        handleGetAllTeachers($pdo);
        break;
    case 'addTeacher':
        handleAddTeacher($pdo, $data);
        break;
    case 'updateTeacher':
        handleUpdateTeacher($pdo, $data);
        break;
    case 'deleteTeacher':
        handleDeleteTeacher($pdo, $data);
        break;
    default:
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
}

// Add these functions after the switch statement
function handleGetAllTeachers($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM teachers ORDER BY created_at DESC");
        $teachers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Remove sensitive data and decode subjects
        foreach ($teachers as &$teacher) {
            unset($teacher['password']);
            $teacher['subject'] = json_decode($teacher['subject'], true);
        }
        
        echo json_encode(['success' => true, 'teachers' => $teachers]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Failed to fetch teachers']);
    }
}

function handleAddTeacher($pdo, $data) {
    try {
        // Check if email or username already exists
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM teachers WHERE email = ? OR username = ?");
        $stmt->execute([$data['email'], $data['username']]);
        if ($stmt->fetchColumn() > 0) {
            throw new Exception('Email or username already exists');
        }

        $stmt = $pdo->prepare("
            INSERT INTO teachers (
                teacher_name,
                father_name,
                username,
                password,
                email,
                class,
                subject,
                address,
                status,
                created_at
            ) VALUES (
                :teacherName,
                :fatherName,
                :username,
                :password,
                :email,
                :class,
                :subject,
                :address,
                :status,
                NOW()
            )
        ");

        $stmt->execute([
            'teacherName' => $data['teacherName'],
            'fatherName' => $data['fatherName'],
            'username' => $data['username'],
            'password' => password_hash($data['password'], PASSWORD_DEFAULT),
            'email' => $data['email'],
            'class' => $data['class'],
            'subject' => json_encode($data['subject']),
            'address' => $data['address'],
            'status' => $data['status'] ?? 'active'
        ]);

        $newTeacherId = $pdo->lastInsertId();
        
        // Fetch the newly created teacher
        $stmt = $pdo->prepare("SELECT * FROM teachers WHERE id = ?");
        $stmt->execute([$newTeacherId]);
        $teacher = $stmt->fetch(PDO::FETCH_ASSOC);
        
        unset($teacher['password']);
        $teacher['subject'] = json_decode($teacher['subject'], true);

        echo json_encode([
            'success' => true,
            'message' => 'Teacher added successfully',
            'teacher' => $teacher
        ]);
    } catch(Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}

function handleUpdateTeacher($pdo, $data) {
    try {
        $teacherId = $data['teacherId'];
        unset($data['teacherId'], $data['action'], $data['profilePicture']); // Remove profilePicture from update data

        // Check if email/username is unique for other teachers
        if (isset($data['email']) || isset($data['username'])) {
            $stmt = $pdo->prepare("
                SELECT COUNT(*) FROM teachers 
                WHERE (email = ? OR username = ?) 
                AND id != ?
            ");
            $stmt->execute([
                $data['email'] ?? '', 
                $data['username'] ?? '', 
                $teacherId
            ]);
            if ($stmt->fetchColumn() > 0) {
                throw new Exception('Email or username already exists');
            }
        }

        // Map frontend field names to database field names
        $fieldMap = [
            'teacherName' => 'teacher_name',
            'fatherName' => 'father_name',
            'username' => 'username',
            'email' => 'email',
            'class' => 'class',
            'subject' => 'subject',
            'address' => 'address',
            'status' => 'status'
        ];

        // Build update query
        $updateFields = [];
        $params = [];
        foreach ($data as $key => $value) {
            if ($key === 'password') {
                if (!empty($value)) {
                    $updateFields[] = "password = ?";
                    $params[] = password_hash($value, PASSWORD_DEFAULT);
                }
                continue;
            }

            $dbKey = $fieldMap[$key] ?? $key;
            if ($key === 'subject') {
                $value = json_encode($value);
            }
            $updateFields[] = "`$dbKey` = ?";
            $params[] = $value;
        }

        // Add updated_at timestamp
        $updateFields[] = "updated_at = NOW()";
        
        if (!empty($updateFields)) {
            $params[] = $teacherId;
            $sql = "UPDATE teachers SET " . implode(', ', $updateFields) . " WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            // Fetch updated teacher
            $stmt = $pdo->prepare("SELECT * FROM teachers WHERE id = ?");
            $stmt->execute([$teacherId]);
            $teacher = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($teacher) {
                unset($teacher['password']);
                $teacher['subject'] = json_decode($teacher['subject'], true);
                $teacher['teacherName'] = $teacher['teacher_name'];
                $teacher['fatherName'] = $teacher['father_name'];

                echo json_encode([
                    'success' => true,
                    'message' => 'Teacher updated successfully',
                    'teacher' => $teacher
                ]);
            } else {
                throw new Exception('Teacher not found after update');
            }
        } else {
            throw new Exception('No fields to update');
        }
    } catch(Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}

function handleDeleteTeacher($pdo, $data) {
    try {
        if (!isset($data['teacherId'])) {
            throw new Exception('Teacher ID is required');
        }
        
        $teacherId = $data['teacherId'];
        
        // Check if teacher exists
        $stmt = $pdo->prepare("SELECT id FROM teachers WHERE id = ?");
        $stmt->execute([$teacherId]);
        if (!$stmt->fetch()) {
            throw new Exception('Teacher not found');
        }
        
        // Delete the teacher
        $stmt = $pdo->prepare("DELETE FROM teachers WHERE id = ?");
        $stmt->execute([$teacherId]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Teacher deleted successfully'
            ]);
        } else {
            throw new Exception('Failed to delete teacher');
        }
    } catch(Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}