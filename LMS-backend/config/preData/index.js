module.exports = {
  COUNTRY: [
    {
      id: 'id',
      createdBy: 'admin',
      createdAt: Math.floor(Date.now() / 1000),
    },
  ],
  COUNTRY_TRANS: [
    {
      id: 'id',
      name: 'India',
      lang: 'en',
      createdBy: 'admin',
      createdAt: Math.floor(Date.now() / 1000),
      countryId: 'id',
    },
    {
      id: 'id',
      name: 'India ar',
      lang: 'ar',
      createdBy: 'admin',
      createdAt: Math.floor(Date.now() / 1000),
      countryId: 'id',
    },
  ],
};
