<?php
// Enable CORS with proper headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set content type to JSON
header("Content-Type: application/json");

// Database connection
$host = "edu.largifysolutions.com"; // Your Hostinger database host
$username = "u421900954_PaperGenerator";
$password = "PaperGeneratorByAhmad786";
$database = "u421900954_ecompapgen";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Handle POST request to add a new question
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the request body
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Check if this is a delete operation
    if (isset($data['action']) && $data['action'] === 'delete') {
        if (!isset($data['questionId'])) {
            http_response_code(400);
            echo json_encode(["error" => "Question ID is required"]);
            exit();
        }
        
        $questionId = $data['questionId'];
        
        $query = "DELETE FROM questions WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $questionId);
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to delete question: " . $stmt->error]);
        }
        
        $stmt->close();
        exit();
    }
    // Check if this is an image delete operation
    else if (isset($data['action']) && $data['action'] === 'delete-image') {
        if (!isset($data['questionId']) || !isset($data['imageIndex'])) {
            http_response_code(400);
            echo json_encode(["error" => "Question ID and image index are required"]);
            exit();
        }
        
        // Get current question
        $query = "SELECT images FROM questions WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $data['questionId']);
        $stmt->execute();
        $result = $stmt->get_result();
        $question = $result->fetch_assoc();
        
        if (!$question) {
            http_response_code(404);
            echo json_encode(["error" => "Question not found"]);
            exit();
        }
        
        // Process images
        $images = $question['images'] ? json_decode($question['images'], true) : [];
        if (isset($images[$data['imageIndex']])) {
            array_splice($images, $data['imageIndex'], 1);
        }
        
        // Update question with new images array
        $updateQuery = "UPDATE questions SET images = ? WHERE id = ?";
        $updateStmt = $conn->prepare($updateQuery);
        $updatedImages = !empty($images) ? json_encode($images) : null;
        $updateStmt->bind_param("ss", $updatedImages, $data['questionId']);
        
        if ($updateStmt->execute()) {
            echo json_encode(["success" => true, "images" => $images]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to delete image: " . $updateStmt->error]);
        }
        
        $updateStmt->close();
        $stmt->close();
        exit();
    }
    // Check if this is an update operation
    else if (isset($data['action']) && $data['action'] === 'update') {
        if (!isset($data['question'])) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid request format"]);
            exit();
        }
        
        $question = $data['question'];
        
        // Process images - ensure they're properly formatted
        $images = isset($question['images']) ? json_encode($question['images']) : null;
        
        // Updated query to include images
        $query = "UPDATE questions SET 
                  text = ?, 
                  options = ?, 
                  parts = ?,
                  answer = ?, 
                  type = ?,
                  chapter = ?,
                  topic = ?,
                  marks = ?,
                  source = ?,
                  medium = ?,
                  class = ?,
                  subject = ?,
                  images = ?
                  WHERE id = ?";
        
        $stmt = $conn->prepare($query);
        
        // Process options and parts based on question type
        $options = $question['type'] === 'mcqs' ? json_encode($question['options']) : null;
        $parts = ($question['type'] === 'long' || strpos($question['type'], 'long') !== false) 
            ? json_encode($question['parts']) 
            : null;
        
        $stmt->bind_param(
            "ssssssssssssss",
            $question['text'],
            $options,
            $parts,
            $question['answer'],
            $question['type'],
            $question['chapter'],
            $question['topic'],
            $question['marks'],
            $question['source'],
            $question['medium'],
            $question['class'],
            $question['subject'],
            $images,
            $question['id']
        );
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update question: " . $stmt->error]);
        }
        
        $stmt->close();
        exit();
    }
    // Regular add question operation
    else if (isset($data['question'])) {
        $question = $data['question'];
        
        // Prepare the SQL query with images column
        $query = "INSERT INTO questions (id, type, chapter, topic, marks, text, options, parts, answer, source, medium, class, subject, images) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($query);
        
        // Convert options, parts, and images to JSON strings
        $options = $question['type'] === 'mcqs' && isset($question['options']) ? json_encode($question['options']) : null;
        $parts = isset($question['parts']) ? json_encode($question['parts']) : null;
        $images = isset($question['images']) ? json_encode($question['images']) : null;
        
        $stmt->bind_param(
            "ssssssssssssss", 
            $question['id'],
            $question['type'],
            $question['chapter'],
            $question['topic'],
            $question['marks'],
            $question['text'],
            $options,
            $parts,
            $question['answer'],
            $question['source'],
            $question['medium'],
            $question['class'],
            $question['subject'],
            $images
        );
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["success" => true, "message" => "Question added successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to add question: " . $stmt->error]);
        }
        
        $stmt->close();
    }
}

// Handle GET request to fetch questions
else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Implementation for GET request (similar to what you had in view-questions)
    $class = isset($_GET['class']) ? $_GET['class'] : null;
    $subject = isset($_GET['subject']) ? $_GET['subject'] : null;
    $unit = isset($_GET['unit']) ? $_GET['unit'] : null;
    $exercise = isset($_GET['exercise']) ? $_GET['exercise'] : null;
    $type = isset($_GET['type']) ? $_GET['type'] : null;
    $search = isset($_GET['search']) ? $_GET['search'] : null;
    
    $query = "SELECT * FROM questions WHERE 1=1";
    $params = [];
    $types = "";
    
    if ($class) {
        $query .= " AND class = ?";
        $params[] = $class;
        $types .= "s";
    }
    
    if ($subject) {
        $query .= " AND subject = ?";
        $params[] = $subject;
        $types .= "s";
    }
    
    if ($unit) {
        $query .= " AND chapter = ?";
        $params[] = $unit;
        $types .= "s";
    }
    
    if ($exercise) {
        $query .= " AND topic = ?";
        $params[] = $exercise;
        $types .= "s";
    }
    
    if ($type && $type !== 'all') {
        $query .= " AND type = ?";
        $params[] = $type;
        $types .= "s";
    }
    
    if ($search) {
        $query .= " AND (text LIKE ? OR chapter LIKE ? OR topic LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $types .= "sss";
    }
    
    // Add ORDER BY to get the most recent questions first
    $query .= " ORDER BY id DESC";
    
    $stmt = $conn->prepare($query);
    
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $rows = [];
    
    // In the GET request handler, add processing for parts
    while ($row = $result->fetch_assoc()) {
        // Process MCQS options
        if ($row['type'] === 'mcqs' && $row['options']) {
            $row['options'] = json_decode($row['options']);
        }
        // Process parts for long questions
        if (strpos($row['type'], 'long') !== false && $row['type'] !== 'long' && $row['parts']) {
            $row['parts'] = json_decode($row['parts']);
        }
        // Process images if they exist
        if ($row['images']) {
            $row['images'] = json_decode($row['images']);
        }
        $rows[] = $row;
    }
    
    echo json_encode($rows);
    $stmt->close();
}

// Handle PUT request for updating questions
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['question'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid request format"]);
        exit();
    }
    
    $question = $data['question'];
    
    // Process images for update
    $images = isset($question['images']) ? json_encode($question['images']) : null;
    
    $query = "UPDATE questions SET 
              type = ?, chapter = ?, topic = ?, marks = ?, 
              text = ?, options = ?, answer = ?, source = ?, 
              medium = ?, class = ?, subject = ?, images = ?
              WHERE id = ?";
    
    $stmt = $conn->prepare($query);
    $options = $question['type'] === 'mcqs' ? json_encode($question['options']) : null;
    
    $stmt->bind_param(
        "sssssssssssss",
        $question['type'],
        $question['chapter'],
        $question['topic'],
        $question['marks'],
        $question['text'],
        $options,
        $question['answer'],
        $question['source'],
        $question['medium'],
        $question['class'],
        $question['subject'],
        $images,
        $question['id']
    );
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Question updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update question: " . $stmt->error]);
    }
    
    $stmt->close();
}

// Handle DELETE request
else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Get questionId from URL parameter instead of request body
    $questionId = isset($_GET['questionId']) ? $_GET['questionId'] : null;
    
    if (!$questionId) {
        http_response_code(400);
        echo json_encode(["error" => "Question ID is required"]);
        exit();
    }
    
    $query = "DELETE FROM questions WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $questionId);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete question: " . $stmt->error]);
    }
    
    $stmt->close();
}

$conn->close();
?>