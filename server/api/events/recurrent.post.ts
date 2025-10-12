// server/api/evenements/recurrent.post.ts
import { defineEventHandler, readBody, createError } from "h3";
import Database from "better-sqlite3";
import path from "path";
import { addDays, addWeeks, addMonths, addYears, format } from "date-fns";
import type { evenement } from "../../db/initEvenementsDb";

const dbPath = path.join(process.cwd(), "server/db/evenements.db");

export default defineEventHandler(async (event) => {
  const db = new Database(dbPath);
  try {
    const body = await readBody(event);
    console.log('Données envoyées pour création récurrente:', body)
    const payloadEvenement = body.evenement as Partial<evenement> | undefined;
    const rawRecurrenceCount = body.recurrenceCount;

    // validations simples
    if (!payloadEvenement) {
      throw createError({ statusCode: 400, statusMessage: "Corps 'evenement' manquant." });
    }

    const recurrenceCount = Number(rawRecurrenceCount) > 0 ? Number(rawRecurrenceCount) : 1;
    if (!payloadEvenement.recurrentRule) {
      throw createError({ statusCode: 400, statusMessage: "recurrentRule requis (daily|weekly|monthly|yearly)." });
    }

    // Récupère tous les champs possibles (tolérant : accepte plusieurs noms si présent)
    const titre = payloadEvenement.titleEvenement ?? "";
    const texte = payloadEvenement.TextEvenement ?? (payloadEvenement as any).descriptionEvenement ?? "";
    const dateDebut = payloadEvenement.dateDebut ?? (payloadEvenement as any).dateDebutEvent;
    const heureDebut = payloadEvenement.heureDebut ?? (payloadEvenement as any).heureDebutEvent ?? null;
    const dateFin = payloadEvenement.dateFin ?? (payloadEvenement as any).dateFinEvent ?? null;
    const heureFin = payloadEvenement.heureFin ?? (payloadEvenement as any).heureFinEvent ?? null;
    const toutLaJournee = !!payloadEvenement.allDay;
    const lieu = payloadEvenement.location ?? null;
    const auteur = payloadEvenement.AuthorEvenement ?? null;
    const gid = payloadEvenement.groupId ?? null;
    const categorie = payloadEvenement.CategoryEvenement ?? null;
    const image = payloadEvenement.ImageEvenement ?? null;
    const tags = payloadEvenement.TagsEvenement ?? null;
    const lien = payloadEvenement.link ?? null;
    const icone = payloadEvenement.icon ?? null;
    const couleur = payloadEvenement.color ?? null;
    
    const statut = payloadEvenement.status ?? "tentative";
    const recurrentRule = payloadEvenement.recurrentRule ?? "";
    const originalDate = payloadEvenement.originalDate ?? dateDebut ?? format(new Date(), "yyyy-MM-dd");

    if (!dateDebut) {
      throw createError({ statusCode: 400, statusMessage: "dateDebut requise pour la récurrence." });
    }

    // Construire des Date objects pour manipulation
    const debutIso = heureDebut ? `${dateDebut}T${heureDebut}` : `${dateDebut}T00:00:00`;
    const debutDateObj = new Date(debutIso);
    let finDateObj: Date | null = null;
    if (dateFin) {
      const finIso = heureFin ? `${dateFin}T${heureFin}` : `${dateFin}T00:00:00`;
      finDateObj = new Date(finIso);
    }

   const insertStmt = db.prepare(`
  INSERT INTO evenements (
    titleEvenement, TextEvenement,
    dateDebut, heureDebut, dateFin, heureFin, allDay, location,
    AuthorEvenement, groupId, CategoryEvenement, ImageEvenement, TagsEvenement, link, icon, color,
    isRecurrent, recurrentId, recurrentRule, originalDate, status
  ) VALUES (
    @title, @texte,
    @dateDebut, @heureDebut, @dateFin, @heureFin, @allDay, @location,
    @author, @groupId, @category, @image, @tags, @link, @icon, @color,
    @isRecurrent, @recurrentId, @recurrentRule, @originalDate, @status
  )
`);


    // Fonction d'ajout de N occurrences dans une transaction
    const ajouterSerie = db.transaction(() => {
      // 1) Insérer le master avec recurrentId temporaire = 0
      const masterInfo = insertStmt.run({
        title: titre,
        texte,
        dateDebut: format(debutDateObj, "yyyy-MM-dd"),
        heureDebut: heureDebut,
        dateFin: finDateObj ? format(finDateObj, "yyyy-MM-dd") : null,
        heureFin: finDateObj ? format(finDateObj, "HH:mm:ss") : null,
        allDay: toutLaJournee ? 1 : 0,
        location: lieu,
        author: auteur,
        groupId: gid,
        category: categorie,
        image,
        tags,
        link: lien,
        icon: icone,
        color: couleur,
        isRecurrent: 1,
        recurrentId: 0, // temporaire
        recurrentRule,
        originalDate: originalDate,
        status: statut
      });

      const masterId = masterInfo.lastInsertRowid;
      const dateDebutMaster = new Date(`${format(debutDateObj, 'yyyy-MM-dd')}T${heureDebut}`);
      const dateFinMaster = finDateObj
  ? new Date(`${format(finDateObj, 'yyyy-MM-dd')}T${heureFin}`): null;
      const firstOccurrence = 1; // pour la première occurrence (i=0 est le master)
      // durée de l'événement en ms (0 si pas de dateFin)
      const dureeMs = dateFinMaster ? dateFinMaster.getTime() - dateDebutMaster.getTime() : 0;
           

      // 2) mettre à jour le master pour qu'il ait son recurrentId = masterId
      db.prepare("UPDATE evenements SET recurrentId = @id WHERE id = @id").run({ id: masterId });

      // 3) insérer les occurrences (si recurrenceCount > 1)
      let courantDébut = new Date(debutDateObj);
      let courantFin = finDateObj ? new Date(finDateObj) : null;

      // map règle -> fonction
      const mapAdd: Record<string, (d: Date, step: number) => Date> = {
        daily: addDays,
        weekly: addWeeks,
        monthly: addMonths,
        yearly: addYears
      };

      const stepFn = mapAdd[recurrentRule];
      if (!stepFn) {
        throw createError({ statusCode: 400, statusMessage: `Règle de récurrence inconnue: ${recurrentRule}` });
      }

      for (let iteration = 1; iteration < recurrenceCount; iteration++) {
    // avance les dates
    courantDébut = stepFn(courantDébut, 1);
    const finOccurrence = new Date(courantDébut.getTime() + dureeMs); // basé sur courantDébut

    insertStmt.run({
      title: titre,
      texte,
      dateDebut: format(courantDébut, "yyyy-MM-dd"),
      heureDebut: heureDebut,
      dateFin: finOccurrence ? format(finOccurrence, "yyyy-MM-dd") : null,
      heureFin: finOccurrence ? format(finOccurrence, "HH:mm:ss") : null,
      allDay: toutLaJournee ? 1 : 0,
      location: lieu,
      author: auteur,
      groupId: gid,
      category: categorie,
      image,
      tags,
      link: lien,
      icon: icone,
      color: couleur,
      isRecurrent: 1,
      recurrentId: masterId,
      recurrentRule,
      originalDate: originalDate,
      status: statut
    });
}

      return masterId;
    });

    const idMaster = ajouterSerie();

    return {
      success: true,
      message: `Série créée : ${recurrenceCount} occurrence(s) (master id ${idMaster}).`,
      masterId: idMaster,
      count: recurrenceCount
    };
  } catch (err) {
    console.error("Erreur lors de l'ajout des événements récurrents:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de l'ajout des événements récurrents."
    });
  } finally {
    db.close();
  }
});
