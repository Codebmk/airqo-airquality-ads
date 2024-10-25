const fetchWithJWT = async (url, token) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      'Authorization': `JWT ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
};

const fetchWithAccessToken = async (url, token) => {
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
  return fetchWithAccessToken(url, token);
};

export const getCohorts = async (token) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/devices/cohorts/summary`;
  return fetchWithJWT(url, token);
};
