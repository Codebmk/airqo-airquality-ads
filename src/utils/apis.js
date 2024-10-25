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

export const getDailyPredictions = async (token, siteId) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/predict/daily-forecast?site_id=${siteId}&token=${token}`;
  const response = await fetchWithAccessToken(url);
  return response.forecasts; // Return the forecasts array directly
};

// New API function to get a summary of grids
export const getGridsSummary = async (token) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/devices/grids/summary?token=${token}`;
  return fetchWithAccessToken(url);
};

// New API function to get measurements for a specific grid
export const getGridMeasurements = async (token, gridId) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/devices/measurements/grids/${gridId}?token=${token}`;
  return fetchWithAccessToken(url);
};
