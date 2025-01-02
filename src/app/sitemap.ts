import { MetadataRoute } from 'next'
const MAIN_URL = process.env.MAIN_URL; 


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${MAIN_URL}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${MAIN_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${MAIN_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${MAIN_URL}/project`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${MAIN_URL}/sign-in`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${MAIN_URL}/sign-up`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
  ];
}