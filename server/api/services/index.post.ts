// server/api/services/index.post.ts
import { insertService } from '~/server/utils/services'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Drizzle va valider automatiquement selon le schéma
  const newService = await insertService({
    title: body.title,
    description: body.description,
    icon: body.icon,
    image: body.image,
    link: body.link,
    color: body.color,
    tags: body.tags,
    contenu: body.contenu,
  })
  
  return { success: true, service: newService }
})