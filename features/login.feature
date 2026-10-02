@login @regression
Feature: Inicio de sesión
  Como cliente de Sauce Demo
  Quiero iniciar sesión con mis credenciales
  Para poder acceder al catálogo y comprar productos

  @smoke
  Scenario: Inicio de sesión exitoso con usuario estándar
    Given el usuario está en la página de inicio de sesión
    When inicia sesión como "standard_user"
    Then debería ver el catálogo de productos

  @negative
  Scenario Outline: Inicio de sesión rechazado: <caso>
    Given el usuario está en la página de inicio de sesión
    When intenta iniciar sesión con usuario "<usuario>" y contraseña "<contraseña>"
    Then debería ver el mensaje de error de inicio de sesión "<mensaje>"
    And debería permanecer en la página de inicio de sesión

    Examples:
      | caso                  | usuario         | contraseña     | mensaje                                                                   |
      | usuario bloqueado     | locked_out_user | secret_sauce   | Epic sadface: Sorry, this user has been locked out.                       |
      | contraseña incorrecta | standard_user   | clave_invalida | Epic sadface: Username and password do not match any user in this service |
      | usuario inexistente   | usuario_falso   | secret_sauce   | Epic sadface: Username and password do not match any user in this service |
      | usuario vacío         |                 | secret_sauce   | Epic sadface: Username is required                                        |
      | contraseña vacía      | standard_user   |                | Epic sadface: Password is required                                        |
