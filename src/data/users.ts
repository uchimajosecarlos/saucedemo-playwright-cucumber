import { config } from '../support/config';

export interface Credentials {
  readonly username: string;
  readonly password: string;
}

const users: Readonly<Record<string, Credentials>> = {
  standard_user: { username: 'standard_user', password: config.password },
  locked_out_user: { username: 'locked_out_user', password: config.password },
};

/** Devuelve las credenciales de un usuario de prueba por su nombre de usuario. */
export function getUser(username: string): Credentials {
  if (!Object.hasOwn(users, username)) {
    const available = Object.keys(users).join(', ');
    throw new Error(`Usuario de prueba desconocido: "${username}". Disponibles: ${available}.`);
  }
  return users[username];
}
