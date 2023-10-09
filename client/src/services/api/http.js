export async function getData(endpoint, options, url, headers = {}) {
  const searchParams = new URLSearchParams(options);

  try {

    const response = await fetch(endpoint + searchParams, { headers: headers });
    if (!response.ok) {
      throw new Error(response.status, url);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(
      `${error}. Error fetching data from ${endpoint} on ${url} page`
    );
    return null;
  }
}