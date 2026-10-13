export default function sitemap() {
  const baseUrl = 'https://www.pibiopenintelligence.com';
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];
}
