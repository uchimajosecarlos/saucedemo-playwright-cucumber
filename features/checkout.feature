@checkout @regression
Feature: Proceso de compra
  Como cliente de Sauce Demo
  Quiero completar el proceso de compra
  Para adquirir los productos de mi carrito

  Background:
    Given el usuario inició sesión como "standard_user"
    And agrega los siguientes productos al carrito:
      | producto              |
      | Sauce Labs Backpack   |
      | Sauce Labs Bike Light |
    And abre el carrito
    And continúa con el checkout

  Scenario: El resumen de la compra muestra los productos y totales correctos
    When completa sus datos con nombre "Ana", apellido "Torres" y código postal "15001"
    Then el resumen debería listar los productos agregados
    And el total de artículos debería ser la suma de los precios
    And el total a pagar debería ser el total de artículos más el impuesto

  @negative
  Scenario Outline: Datos del cliente incompletos: <caso>
    When completa sus datos con nombre "<nombre>", apellido "<apellido>" y código postal "<codigo_postal>"
    Then debería ver el mensaje de error del formulario "<mensaje>"

    Examples:
      | caso              | nombre | apellido | codigo_postal | mensaje                        |
      | sin nombre        |        | Torres   | 15001         | Error: First Name is required  |
      | sin apellido      | Ana    |          | 15001         | Error: Last Name is required   |
      | sin código postal | Ana    | Torres   |               | Error: Postal Code is required |

  Scenario: Completar la compra hasta la confirmación
    When completa sus datos con nombre "Ana", apellido "Torres" y código postal "15001"
    And finaliza la compra
    Then debería ver el mensaje de confirmación "Thank you for your order!"
    And el carrito debería quedar vacío
