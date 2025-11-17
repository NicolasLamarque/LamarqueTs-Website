export const useAssets = () => {
 const BLOB_URL = 'https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com';
  
  return {
    images: {
      intervention: `${BLOB_URL}/Intervention1.png`,
      service2: `${BLOB_URL}/Service2.png`,
      lamarqueGroupe: `${BLOB_URL}/LamarqueGroupe.png`
    }
  };
}
