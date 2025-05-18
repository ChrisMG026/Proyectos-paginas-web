<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuración de la base de datos
$host = 'localhost';
$dbname = 'sushi_regio';
$username = 'root';
$password = '';

$conn = null; // Inicializamos como null

try {
    // 1. Primero intentamos la conexión
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 2. Verificamos si recibimos datos JSON válidos
    $json = file_get_contents('php://input');
    if (empty($json)) {
        throw new Exception('No se recibieron datos');
    }
    
    $data = json_decode($json, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON inválido: ' . json_last_error_msg());
    }

    // 3. Iniciamos transacción
    $conn->beginTransaction();
    
    // Insertar pedido principal
    $stmt = $conn->prepare("INSERT INTO pedidos (total) VALUES (:total)");
    $stmt->bindParam(':total', $data['total'], PDO::PARAM_STR);
    $stmt->execute();
    $pedido_id = $conn->lastInsertId();
    
    // Insertar platillos
    if (!empty($data['platillos'])) {
        $stmtPlatillos = $conn->prepare("INSERT INTO pedido_platillos (pedido_id, nombre_platillo, precio) VALUES (:pedido_id, :nombre, :precio)");
        foreach ($data['platillos'] as $platillo) {
            $precio = is_numeric($platillo['precio']) ? $platillo['precio'] : floatval(str_replace('$', '', $platillo['precio']));
            $stmtPlatillos->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
            $stmtPlatillos->bindParam(':nombre', $platillo['nombre'], PDO::PARAM_STR);
            $stmtPlatillos->bindParam(':precio', $precio, PDO::PARAM_STR);
            $stmtPlatillos->execute();
        }
    }
    
    // Insertar complementos
    if (!empty($data['complementos'])) {
        $stmtComplementos = $conn->prepare("INSERT INTO pedido_complementos (pedido_id, nombre_complemento, precio) VALUES (:pedido_id, :nombre, :precio)");
        foreach ($data['complementos'] as $complemento) {
            $precio = is_numeric($complemento['precio']) ? $complemento['precio'] : floatval(str_replace('$', '', $complemento['precio']));
            $stmtComplementos->bindParam(':pedido_id', $pedido_id, PDO::PARAM_INT);
            $stmtComplementos->bindParam(':nombre', $complemento['nombre'], PDO::PARAM_STR);
            $stmtComplementos->bindParam(':precio', $precio, PDO::PARAM_STR);
            $stmtComplementos->execute();
        }
    }
    
    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Pedido registrado con éxito']);

} catch(PDOException $e) {
    if ($conn !== null) {
        $conn->rollBack();
    }
    echo json_encode([
        'success' => false,
        'message' => 'Error de base de datos: ' . $e->getMessage(),
        'error_code' => $e->getCode()
    ]);
} catch(Exception $e) {
    if ($conn !== null) {
        $conn->rollBack();
    }
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>