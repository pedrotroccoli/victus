let memoryToken = localStorage.getItem('@victus::token');

export const getToken = () => {
  const token = memoryToken || localStorage.getItem('@victus::token');

  return token;
}

export const setToken = async (token: string) => {
  localStorage.setItem('@victus::token', token);

  memoryToken = token;
}

export const removeToken = async () => {
  localStorage.removeItem('@victus::token');

  memoryToken = null;
}
