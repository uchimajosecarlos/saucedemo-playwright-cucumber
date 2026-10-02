@e2e @smoke @regression
Feature: Compra completa
  Como un cliente de Sauce Demo
  Quiero poder iniciar sesión, agregar productos al carrito y completar una compra
  Para poder adquirir los productos que necesito

  Scenario: Un cliente estándar compra dos productos de principio a fin
    Given el usuario está en la página de inicio de sesión
    When inicia sesión como "standard_user"
    Then debería ver el catálogo de productos
    When agrega los siguientes productos al carrito:
      | producto                 |
      | Sauce Labs Fleece Jacket |
      | Sauce Labs Onesie        |
    And abre el carrito
    Then el carrito debería contener exactamente:
      | producto                 | precio |
      | Sauce Labs Fleece Jacket | $49.99 |
      | Sauce Labs Onesie        | $7.99  |
    When continúa con el checkout
    And completa sus datos con nombre "Ana", apellido "Torres" y código postal "15001"
    Then el resumen debería listar los productos agregados
    And el total a pagar debería ser el total de artículos más el impuesto
    When finaliza la compra
    Then debería ver el mensaje de confirmación "Thank you for your order!"
    And el carrito debería quedar vacío
