export const useFormatDate = () => {
  const formatDate = (date: string | Date, locale: string = 'fr-FR') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj)
  }
  
  return { formatDate }
}