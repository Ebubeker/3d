// Centralised JSON-LD builders so all pages reference the same Organization
// node by @id, which is what Google expects for graph linking.
//
// Anything that changes facts about the company (address, contact, social
// profiles, founding year, services) should be edited here, not duplicated
// in each layout.

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://virtuality.fashion';

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export interface JsonLdGraph {
  '@context': 'https://schema.org';
  '@graph': Record<string, unknown>[];
}

export function organizationNode(): Record<string, unknown> {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'virtuality.fashion',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/logo.png`,
    },
    image: `${SITE_URL}/images/og-image.jpg`,
    description:
      'Curated marketplace connecting fashion brands with vetted 3D designers and technical developers. Virtual sampling, tech pack creation, CLO3D and Browzwear expertise.',
    foundingDate: '2015',
    sameAs: [
      'https://www.instagram.com/virtuality.fashion/',
      'https://www.linkedin.com/company/virtuality-fashion/',
      'https://www.facebook.com/virtuality.fashion',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@virtuality.fashion',
      contactType: 'customer support',
      availableLanguage: ['English'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
    },
  };
}

export function websiteNode(): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: 'virtuality.fashion',
    description:
      'Virtual sampling and tech pack services for fashion brands.',
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-US',
  };
}

// The /solutions page. Lists the concrete services we offer as an
// OfferCatalog so Google can show each as an eligible item.
export function servicesNode(): Record<string, unknown> {
  return {
    '@type': 'Service',
    '@id': `${SITE_URL}/solutions#service`,
    name: 'Virtual Sampling & Tech Pack Services',
    serviceType: 'Fashion Development',
    provider: { '@id': ORGANIZATION_ID },
    areaServed: 'Worldwide',
    url: `${SITE_URL}/solutions`,
    description:
      'End-to-end virtual sampling, tech pack creation, 3D garment design, and technical development services for fashion brands. Reduce physical samples by up to 70% and cut development time in half.',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Fashion Development Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Virtual Sampling',
            description:
              'Photorealistic 3D garment simulation to validate fit, fabric, and design before producing physical samples.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Tech Pack Creation',
            description:
              'Production-ready technical packs with detailed flats, measurements, construction notes, and BOM.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '3D Fashion Design',
            description:
              'Garment design and patternmaking in CLO3D, Browzwear, and Marvelous Designer.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Technical Design',
            description:
              'Specification-driven technical design including grading, fit corrections, and construction details.',
          },
        },
      ],
    },
  };
}

export function siteGraph(): JsonLdGraph {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationNode(), websiteNode()],
  };
}

export function solutionsGraph(): JsonLdGraph {
  return {
    '@context': 'https://schema.org',
    '@graph': [servicesNode()],
  };
}
