import React from 'react';

interface PersonJsonLdProps {
  name?: string;
  jobTitle?: string;
  url?: string;
  sameAs?: string[];
}

export function PersonJsonLd({ name, jobTitle, url, sameAs }: PersonJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name || 'Saeful',
    jobTitle: jobTitle || 'Senior Fullstack Software Architect',
    url: url || process.env.NEXT_PUBLIC_SITE_URL || 'https://saeful.dev',
    sameAs: sameAs || [
      'https://github.com',
      'https://linkedin.com',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}