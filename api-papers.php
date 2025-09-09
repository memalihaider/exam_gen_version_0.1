<?php
// More comprehensive CORS headers
header("Access-Control-Allow-Origin: *"); // Temporarily use * for testing
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: false"); // Set to false when using *
header("Access-Control-Max-Age: 86400");

// Handle preflight OPTIONS request with explicit response
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Send additional headers for OPTIONS
    header("HTTP/1.1 200 OK");
    header("Content-Length: 0");
    exit();
}

// Set content type after OPTIONS check
header("Content-Type: application/json");

// Hostinger MySQL connection details
$db_host = 'edu.largifysolutions.com';
$db_name = 'u421900954_ecompapgen';
$db_user = 'u421900954_PaperGenerator';
$db_pass = 'PaperGeneratorByAhmad786';

try {
    $conn = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get papers based on status
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $status = isset($_GET['status']) ? $_GET['status'] : 'SAVED';
        $stmt = $conn->prepare("SELECT * FROM allpapers WHERE status = ? ORDER BY created_at DESC");
        $stmt->execute([$status]);
        $papers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($papers);
    }
    
    // Handle PATCH requests for status updates
    if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Extract paper ID from request body instead of URL
        if (!isset($input['paperId']) || !isset($input['status'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing paperId or status in request body']);
            exit();
        }
        
        $paperId = $input['paperId'];
        $status = $input['status'];
        
        // First check if the paper exists
        $checkStmt = $conn->prepare("SELECT id FROM allpapers WHERE id = ?");
        $checkStmt->execute([$paperId]);
        
        if ($checkStmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Paper not found']);
            exit();
        }
        
        // Update the paper status
        $stmt = $conn->prepare("UPDATE allpapers SET status = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$status, $paperId]);
        
        // Check if the update was successful
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Status updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update paper status']);
        }
    }

    // Handle POST request for saving papers AND status updates
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $rawData = file_get_contents('php://input');
            $input = json_decode($rawData, true);
            
            if (!$input && $_POST) {
                $input = $_POST;
            }
            
            // Check if this is a status update request
            if (isset($input['action']) && $input['action'] === 'update_status') {
                if (!isset($input['paperId']) || !isset($input['status'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Missing paperId or status in request body']);
                    exit();
                }
                
                $paperId = $input['paperId'];
                $status = $input['status'];
                
                // First check if the paper exists
                $checkStmt = $conn->prepare("SELECT id FROM allpapers WHERE id = ?");
                $checkStmt->execute([$paperId]);
                
                if ($checkStmt->rowCount() === 0) {
                    http_response_code(404);
                    echo json_encode(['error' => 'Paper not found']);
                    exit();
                }
                
                // Update the paper status
                $stmt = $conn->prepare("UPDATE allpapers SET status = ?, updated_at = NOW() WHERE id = ?");
                $stmt->execute([$status, $paperId]);
                
                if ($stmt->rowCount() > 0) {
                    echo json_encode(['success' => true, 'message' => 'Status updated successfully']);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to update paper status']);
                }
                return;
            }
            
            // Final validation
            if (!$input || !isset($input['class']) || !isset($input['subject'])) {
                throw new Exception('Invalid input data: Required fields missing');
            }
            
            // Use current timestamp if not provided
            $created_at = isset($input['created_at']) ? $input['created_at'] : date('Y-m-d H:i:s');
            $updated_at = isset($input['updated_at']) ? $input['updated_at'] : date('Y-m-d H:i:s');
            
            // Prepare and execute the SQL statement - only using columns that exist in the table
            $stmt = $conn->prepare("INSERT INTO allpapers (
                class, 
                subject, 
                content, 
                status, 
                created_at, 
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?)");

            $stmt->execute([
                $input['class'],
                $input['subject'],
                $input['content'],
                $input['status'] ?? 'SAVED',
                $created_at,
                $updated_at
            ]);

            echo json_encode(['success' => true, 'message' => 'Paper saved successfully', 'id' => $conn->lastInsertId()]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to process request: ' . $e->getMessage()]);
        }
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
}
?>

