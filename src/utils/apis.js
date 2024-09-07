const fetchWithToken = async (url, token) => {
  const res = await fetch(url, {
    method: "GET"
  });

  return res.json();
};

export const getAQDataApi = async (token) => {
  // https://api.airqo.net/api/v2/devices/measurements/cohorts/66dbf9f0068a5300139b41c5
  const url = `https://api.airqo.net/api/v2/devices/measurements/cohorts/66dbf9f0068a5300139b41c5?token=${token}`;
  return fetchWithToken(url, token);
};
