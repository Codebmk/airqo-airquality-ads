
const fetchWithAccessToken = async (url) => {
  const res = await fetch(url, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
};

export const getAQDataApi = async (token, cohortId) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/devices/measurements/cohorts/${cohortId}?token=${token}`;
  return fetchWithAccessToken(url);
};

export const getCohorts = async (token) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/devices/cohorts/summary?token=${token}`;
  return fetchWithAccessToken(url);
};
