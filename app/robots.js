export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/open-intelligence',
        '/contribute',
        '/meetings',
        '/contact-us',
        '/students',
        '/student',
        '/admin',
        '/api',
      ],
    },
    sitemap: 'https://www.pibiopenintelligence.com/sitemap.xml',
  };
}
