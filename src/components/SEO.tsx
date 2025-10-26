import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
}

export function SEO({
  title = 'HorasETT - Calcula tu salario real y controla tus horas',
  description = 'Calculadora gratuita de salario neto para trabajadores temporales. Registra tus horas, calcula tu nómina y conoce tus derechos laborales. 100% privado, local-first, sin registro.',
  keywords = 'calculadora salario neto, ETT, trabajo temporal, control horas trabajo, derechos laborales, calcular nómina, registro horario',
  canonical,
}: SEOProps) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : (typeof window !== 'undefined' ? window.location.href : '')

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Canonical */}
      <link rel="canonical" href={fullCanonical} />
    </Helmet>
  )
}