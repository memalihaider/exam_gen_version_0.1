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
    case 'getAllStudents':
        handleGetAllStudents($pdo);
        break;
    case 'addStudent':
        handleAddStudent($pdo, $data);
        break;
    case 'updateStudent':
        handleUpdateStudent($pdo, $data);
        break;
    case 'deleteStudent':
        handleDeleteStudent($pdo, $data);
        break;
    default:
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
}

function handleGetAllStudents($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM students ORDER BY created_at DESC");
        $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'students' => $students]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Failed to fetch students']);
    }
}

function handleAddStudent($pdo, $data) {
    try {
        // Check if admission_number or email already exists
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM students WHERE admission_number = ? OR email = ?");
        $stmt->execute([$data['admissionNumber'], $data['email']]);
        if ($stmt->fetchColumn() > 0) {
            throw new Exception('Admission number or email already exists');
        }

        $stmt = $pdo->prepare("
            INSERT INTO students (
                student_name,
                father_name,
                admission_number,
                email,
                class,
                address,
                phone,
                date_of_birth,
                gender,
                status,
                created_at
            ) VALUES (
                :studentName,
                :fatherName,
                :admissionNumber,
                :email,
                :class,
                :address,
                :phone,
                :dateOfBirth,
                :gender,
                :status,
                NOW()
            )
        ");

        $stmt->execute([
            'studentName' => $data['studentName'],
            'fatherName' => $data['fatherName'],
            'admissionNumber' => $data['admissionNumber'],
            'email' => $data['email'],
            'class' => $data['class'],
            'address' => $data['address'],
            'phone' => $data['phone'],
            'dateOfBirth' => $data['dateOfBirth'],
            'gender' => $data['gender'],
            'status' => $data['status'] ?? 'active'
        ]);

        $newStudentId = $pdo->lastInsertId();
        
        // Fetch the newly created student
        $stmt = $pdo->prepare("SELECT * FROM students WHERE id = ?");
        $stmt->execute([$newStudentId]);
        $student = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'message' => 'Student added successfully',
            'student' => $student
        ]);
    } catch(Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}

function handleUpdateStudent($pdo, $data) {
    try {
        $studentId = $data['studentId'];
        unset($data['studentId'], $data['action'], $data['profilePicture']);

        // Check if admission_number/email is unique for other students
        if (isset($data['admissionNumber']) || isset($data['email'])) {
            $stmt = $pdo->prepare("
                SELECT COUNT(*) FROM students 
                WHERE (admission_number = ? OR email = ?) 
                AND id != ?
            ");
            $stmt->execute([
                $data['admissionNumber'] ?? '', 
                $data['email'] ?? '', 
                $studentId
            ]);
            if ($stmt->fetchColumn() > 0) {
                throw new Exception('Admission number or email already exists');
            }
        }

        // Map frontend field names to database field names
        $fieldMap = [
            'studentName' => 'student_name',
            'fatherName' => 'father_name',
            'admissionNumber' => 'admission_number',
            'email' => 'email',
            'class' => 'class',
            'address' => 'address',
            'phone' => 'phone',
            'dateOfBirth' => 'date_of_birth',
            'gender' => 'gender',
            'status' => 'status'
        ];

        // Build update query
        $updateFields = [];
        $params = [];
        foreach ($data as $key => $value) {
            $dbKey = $fieldMap[$key] ?? $key;
            $updateFields[] = "`$dbKey` = ?";
            $params[] = $value;
        }

        // Add updated_at timestamp
        $updateFields[] = "updated_at = NOW()";
        
        if (!empty($updateFields)) {
            $params[] = $studentId;
            $sql = "UPDATE students SET " . implode(', ', $updateFields) . " WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            // Fetch updated student
            $stmt = $pdo->prepare("SELECT * FROM students WHERE id = ?");
            $stmt->execute([$studentId]);
            $student = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($student) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Student updated successfully',
                    'student' => $student
                ]);
            } else {
                throw new Exception('Student not found after update');
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

function handleDeleteStudent($pdo, $data) {
    try {
        if (!isset($data['studentId'])) {
            throw new Exception('Student ID is required');
        }
        
        $studentId = $data['studentId'];
        
        // Check if student exists
        $stmt = $pdo->prepare("SELECT id FROM students WHERE id = ?");
        $stmt->execute([$studentId]);
        if (!$stmt->fetch()) {
            throw new Exception('Student not found');
        }
        
        // Delete the student
        $stmt = $pdo->prepare("DELETE FROM students WHERE id = ?");
        $stmt->execute([$studentId]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Student deleted successfully'
            ]);
        } else {
            throw new Exception('Failed to delete student');
        }
    } catch(Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}
?>