<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "localhost:4306";
$database = "database";
$username = "helloworld";
$password = "admin1234";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Log the raw input data
file_put_contents('log.txt', file_get_contents('php://input'));

// Get JSON data
$input_data = json_decode(file_get_contents('php://input'), true);

// Extract data
$ageCategory = mysqli_real_escape_string($conn, $input_data['ageCategory']);
$weightInKg = mysqli_real_escape_string($conn, $input_data['weightInKg']);
$weightUnit = mysqli_real_escape_string($conn, $input_data['weightUnit']);
$heightInM = mysqli_real_escape_string($conn, $input_data['heightInM']);
$heightUnit = mysqli_real_escape_string($conn, $input_data['heightUnit']);
$bmiResult = mysqli_real_escape_string($conn, $input_data['bmiResult']);
$bmiStatus = mysqli_real_escape_string($conn, $input_data['bmiStatus']);

// Debugging: Check the values before insertion
var_dump($weightInKg);

// SQL query with prepared statement
$sql = "INSERT INTO results (age_category, weight_in_kg, weight_unit, height_in_m, height_unit, bmi_result, bmi_status) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssss", $ageCategory, $weightInKg, $weightUnit, $heightInM, $heightUnit, $bmiResult, $bmiStatus);

if ($stmt->execute()) {
    echo "Result saved successfully";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
