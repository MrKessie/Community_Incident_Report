<?php

try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('CREATE DATABASE IF NOT EXISTS cir_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    echo "MySQL Database 'cir_system' created or already exists successfully.\n";
} catch (Exception $e) {
    echo "MySQL Note: " . $e->getMessage() . "\n";
}
