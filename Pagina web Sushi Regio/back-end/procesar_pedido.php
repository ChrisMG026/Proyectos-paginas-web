<?php
header('Content-Type: application/json');

// Configuración de la base de datos
$host = 'localhost';
$dbname = 'sushi_regio';
$username = 'root'; // Usuario por defecto en XAMPP
$password = '2621'; // Contraseña por defecto en XAMPP (vacía)

try {
    $testConn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    echo json_encode(['success' => true, 'message' => '¡Conexión exitosa a la BD!']);
    exit;
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
    exit;
}

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obtener datos del POST
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Iniciar transacción
    $conn->beginTransaction();
    
    // Insertar pedido principal
    $stmt = $conn->prepare("INSERT INTO pedidos (total) VALUES (:total)");
    $stmt->bindParam(':total', $data['total']);
    $stmt->execute();
    $pedido_id = $conn->lastInsertId();
    
    // Insertar platillos
    $stmtPlatillos = $conn->prepare("INSERT INTO pedido_platillos (pedido_id, nombre_platillo, precio) VALUES (:pedido_id, :nombre, :precio)");
    foreach ($data['platillos'] as $platillo) {
        $nombre = $platillo['nombre'];
        $precio = floatval(str_replace('$', '', $platillo['precio']));
        $stmtPlatillos->bindParam(':pedido_id', $pedido_id);
        $stmtPlatillos->bindParam(':nombre', $nombre);
        $stmtPlatillos->bindParam(':precio', $precio);
        $stmtPlatillos->execute();
    }
    
    // Insertar complementos
    $stmtComplementos = $conn->prepare("INSERT INTO pedido_complementos (pedido_id, nombre_complemento, precio) VALUES (:pedido_id, :nombre, :precio)");
    foreach ($data['complementos'] as $complemento) {
        $nombre = $complemento['nombre'];
        $precio = floatval(str_replace('$', '', $complemento['precio']));
        $stmtComplementos->bindParam(':pedido_id', $pedido_id);
        $stmtComplementos->bindParam(':nombre', $nombre);
        $stmtComplementos->bindParam(':precio', $precio);
        $stmtComplementos->execute();
    }
    
    // Confirmar transacción
    $conn->commit();
    
    echo json_encode(['success' => true, 'message' => 'Pedido registrado con éxito']);
} catch(PDOException $e) {
    $conn->rollBack();
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>