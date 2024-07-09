const fetchWithToken = async (url, token) => {
  const res = await fetch(url, {
    method: "GET"
  });

  return res.json();
};

export const getAQDataApi = async (token) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/devices/measurements/grids/64d6348a5684130013803290?token=${token}`;
  return fetchWithToken(url, token);
};
