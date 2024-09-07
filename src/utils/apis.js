const fetchWithToken = async (url, token) => {
  const res = await fetch(url, {
    method: "GET"
  });

  return res.json();
};

export const getAQDataApi = async (token) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/devices/measurements/cohorts/66dbf9f0068a5300139b41c5?token=${token}`;
  return fetchWithToken(url, token);
};
