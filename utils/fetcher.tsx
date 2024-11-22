export const callApi = async (url = '') => {
  try {
    const response = await fetch(url);
    const result = await response.json();

    return result;
  } catch (err) {
    return null;
  }
};
