<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$uploadDir = 'uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$response = ['success' => false, 'message' => '', 'urls' => []];

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_FILES['images'])) {
            // Handle single or multiple files
            $files = is_array($_FILES['images']['name']) ? $_FILES['images'] : [$_FILES['images']];
            
            foreach ($files as $file) {
                if ($file['error'] === UPLOAD_ERR_OK) {
                    $fileName = uniqid() . '_' . basename($file['name']);
                    $targetPath = $uploadDir . $fileName;
                    
                    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                        $response['urls'][] = 'https://edu.largifysolutions.com/' . $uploadDir . $fileName;
                    }
                }
            }
            
            if (!empty($response['urls'])) {
                $response['success'] = true;
                $response['message'] = count($response['urls']) . ' image(s) uploaded successfully';
            } else {
                $response['message'] = 'No files were uploaded';
            }
        } else {
            $response['message'] = 'No files received';
        }
    } else {
        $response['message'] = 'Invalid request method';
    }
} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
}

echo json_encode($response);
?>