@cart @regression
Feature: Carrito de compras
  Como cliente de Sauce Demo
  Quiero agregar productos a mi carrito
  Para revisar lo que voy a comprar

  Background:
    Given el usuario inició sesión como "standard_user"

  @smoke
  Scenario: Agregar un producto desde la página de productos
    When agrega el producto "Sauce Labs Backpack" al carrito
    Then el contador del carrito debería mostrar "1"
    And el botón del producto "Sauce Labs Backpack" debería cambiar a "Remove"

  Scenario: Ver en el carrito los productos agregados
    When agrega los siguientes productos al carrito:
      | producto              |
      | Sauce Labs Backpack   |
      | Sauce Labs Bike Light |
      | Sauce Labs Onesie     |
    And abre el carrito
    Then el carrito debería contener exactamente:
      | producto              | precio |
      | Sauce Labs Backpack   | $29.99 |
      | Sauce Labs Bike Light | $9.99  |
      | Sauce Labs Onesie     | $7.99  |
    And el contador del carrito debería mostrar "3"

  Scenario: Quitar un producto del carrito
    When agrega los siguientes productos al carrito:
      | producto              |
      | Sauce Labs Backpack   |
      | Sauce Labs Bike Light |
    And abre el carrito
    And quita el producto "Sauce Labs Backpack" del carrito
    Then el carrito no debería contener el producto "Sauce Labs Backpack"
    And el contador del carrito debería mostrar "1"
