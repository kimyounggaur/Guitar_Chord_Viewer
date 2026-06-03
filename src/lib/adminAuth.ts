export const defaultAdminCredentials = {
  id: 'admin',
  password: 'lesson1234',
} as const;

type AdminCredentialEnv = {
  id?: string;
  password?: string;
};

export function resolveAdminCredentials(env: AdminCredentialEnv = {}) {
  return {
    id: env.id?.trim() || defaultAdminCredentials.id,
    password: env.password || defaultAdminCredentials.password,
  };
}

export function isValidAdminLogin(inputId: string, inputPassword: string, env: AdminCredentialEnv = {}) {
  const credentials = resolveAdminCredentials(env);

  return inputId.trim() === credentials.id && inputPassword === credentials.password;
}
