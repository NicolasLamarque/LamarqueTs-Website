<template>
  <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- En-tête -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center gap-3">
          <i class="fas fa-calendar-alt text-blue-500 text-2xl"></i>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
            Gestion des Services
          </h2>
        </div>
      </div>

      <!-- Formulaire -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {{ isEditing ? 'Modifier le service' : 'Ajouter un service' }}
        </h3>

        <!-- Onglets -->
        <div class="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-3 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Contenu du formulaire -->
        <div class="space-y-6">
          <!-- Onglet Général -->
          <template v-if="activeTab === 'general'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Titre <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Lien
                </label>
                <input
                  v-model="form.link"
                  type="text"
                  placeholder="/services/exemple"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Description <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                required
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Tags
              </label>
              <input
                v-model="form.tags"
                type="text"
                placeholder="web,développement,react (séparés par des virgules)"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </template>

          <!-- Onglet Contenu -->
          <template v-if="activeTab === 'contenu'">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Contenu détaillé
              </label>
              <textarea
                v-model="form.contenu"
                rows="12"
                placeholder="Décrivez en détail votre service..."
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 font-mono text-sm"
              ></textarea>
            </div>
          </template>

          <!-- Onglet Visuel -->
          <template v-if="activeTab === 'visuel'">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Icône (SVG) <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.icon"
                rows="4"
                placeholder="<svg>...</svg>"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 font-mono text-sm"
                required
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                URL de l'image
              </label>
              <input
                v-model="form.image"
                type="text"
                placeholder="https://exemple.com/image.jpg"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Couleur
              </label>
              <div class="flex gap-3 items-center">
                <input
                  v-model="form.color"
                  type="color"
                  class="h-10 w-20 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                />
                <input
                  v-model="form.color"
                  type="text"
                  placeholder="#3B82F6"
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
          </template>

          <!-- Onglet Avancé -->
          <template v-if="activeTab === 'advanced'">
            <div class="flex items-center gap-3">
              <input
                v-model="form.deleted"
                type="checkbox"
                id="deleted"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="deleted" class="text-sm font-medium text-gray-700 dark:text-gray-200">
                Service supprimé (soft delete)
              </label>
            </div>

            <div v-if="form.deleted">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Supprimé par
              </label>
              <input
                v-model="form.deleted_by"
                type="text"
                placeholder="Nom de l'utilisateur"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div v-if="isEditing" class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2">
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-semibold">ID:</span> {{ form.id }}
              </div>
              <div v-if="form.created_at" class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-semibold">Créé le:</span> {{ formatDate(form.created_at) }}
              </div>
              <div v-if="form.updated_at" class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-semibold">Modifié le:</span> {{ formatDate(form.updated_at) }}
              </div>
            </div>
          </template>

          <!-- Boutons d'action -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              v-if="isEditing"
              @click="cancelEdit"
              type="button"
              class="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
            <button
              @click="saveService"
              type="button"
              class="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
            >
              <i class="fas fa-save"></i>
              {{ isEditing ? 'Sauvegarder' : 'Ajouter' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Table des services -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Liste des services
          </h3>
        </div>

        <div v-if="loading" class="text-center py-12 text-gray-500 dark:text-gray-400">
          Chargement des services...
        </div>
        
        <div v-else-if="services.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
          Aucun service trouvé.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Titre
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Tags
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Couleur
                </th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              <tr v-for="service in services" :key="service.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ service.title }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                    {{ service.description }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="(tag, idx) in service.tags?.split(',').slice(0, 3)" 
                      :key="idx"
                      class="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded"
                    >
                      {{ tag.trim() }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div 
                      class="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                      :style="{ backgroundColor: service.color }"
                    ></div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                      {{ service.color }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="viewService(service)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 mr-4"
                  >
                    <i class="fas fa-eye mr-1"></i>
                    Voir
                  </button>
                  <button 
                    @click="editService(service)"
                    class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-4"
                  >
                    <i class="fas fa-edit mr-1"></i>
                    Modifier
                  </button>
                  <button 
                    @click="deleteService(service.id)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                  >
                    <i class="fas fa-trash mr-1"></i>
                    Supprimer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal de visualisation -->
      <div v-if="showPreviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <!-- En-tête de la modal -->
          <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              Aperçu du service
            </h3>
            <button 
              @click="closePreview"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <!-- Contenu de la modal -->
          <div class="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
            <div class="space-y-6">
              <!-- En-tête du service -->
              <div class="flex items-start gap-4">
                <div 
                  class="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                  :style="{ backgroundColor: previewService.color }"
                  v-html="previewService.icon"
                ></div>
                <div class="flex-1">
                  <h4 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {{ previewService.title }}
                  </h4>
                  <p class="text-gray-600 dark:text-gray-300">
                    {{ previewService.description }}
                  </p>
                </div>
              </div>

              <!-- Image -->
              <div v-if="previewService.image" class="rounded-lg overflow-hidden">
                <img 
                  :src="previewService.image" 
                  :alt="previewService.title"
                  class="w-full h-64 object-cover"
                />
              </div>

              <!-- Tags -->
              <div v-if="previewService.tags" class="flex flex-wrap gap-2">
                <span 
                  v-for="(tag, idx) in previewService.tags.split(',')" 
                  :key="idx"
                  class="px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full"
                >
                  {{ tag.trim() }}
                </span>
              </div>

              <!-- Contenu -->
              <div v-if="previewService.contenu" class="prose dark:prose-invert max-w-none">
                <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h5 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Contenu détaillé
                  </h5>
                  <div class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {{ previewService.contenu }}
                  </div>
                </div>
              </div>

              <!-- Lien -->
              <div v-if="previewService.link" class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <a 
                  :href="previewService.link" 
                  class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
                  target="_blank"
                >
                  <i class="fas fa-external-link-alt"></i>
                  Accéder au service
                </a>
              </div>

              <!-- Métadonnées -->
              <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2 text-sm">
                <div class="flex justify-between text-gray-600 dark:text-gray-400">
                  <span class="font-semibold">Couleur:</span>
                  <span class="flex items-center gap-2">
                    <div 
                      class="w-4 h-4 rounded border border-gray-300 dark:border-gray-600"
                      :style="{ backgroundColor: previewService.color }"
                    ></div>
                    {{ previewService.color }}
                  </span>
                </div>
                <div v-if="previewService.created_at" class="flex justify-between text-gray-600 dark:text-gray-400">
                  <span class="font-semibold">Créé le:</span>
                  <span>{{ formatDate(previewService.created_at) }}</span>
                </div>
                <div v-if="previewService.updated_at" class="flex justify-between text-gray-600 dark:text-gray-400">
                  <span class="font-semibold">Modifié le:</span>
                  <span>{{ formatDate(previewService.updated_at) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pied de page -->
          <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <button
              @click="closePreview"
              type="button"
              class="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Fermer
            </button>
            <button
              @click="editServiceFromPreview"
              type="button"
              class="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
            >
              <i class="fas fa-edit"></i>
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// État du composant
const services = ref<any[]>([]);
const loading = ref(true);
const showPreviewModal = ref(false);
const previewService = ref<any>({});
const isEditing = ref(false);
const activeTab = ref('general');
const form = ref({
  id: null,
  title: '',
  description: '',
  contenu: '',
  icon: '',
  image: '',
  link: '',
  color: '#3B82F6',
  tags: '',
  created_at: '',
  updated_at: '',
  deleted_at: '',
  deleted: false,
  deleted_by: ''
});

const tabs = [
  { id: 'general', label: 'Général' },
  { id: 'contenu', label: 'Contenu' },
  { id: 'visuel', label: 'Visuel' },
  { id: 'advanced', label: 'Avancé' }
];

// Récupérer les services
const fetchServices = async () => {
  loading.value = true;
  try {
    const { data, error } = await useFetch('/api/services');
    if (error.value) {
      console.error("Erreur de l'API:", error.value);
    } else {
      services.value = data.value || [];
    }
  } catch (err) {
    console.error("Erreur de récupération des services:", err);
  } finally {
    loading.value = false;
  }
};

// Voir un service (modal de visualisation)
const viewService = (service: any) => {
  previewService.value = { ...service };
  showPreviewModal.value = true;
};

// Fermer la modal de prévisualisation
const closePreview = () => {
  showPreviewModal.value = false;
};

// Éditer depuis la prévisualisation
const editServiceFromPreview = () => {
  closePreview();
  editService(previewService.value);
  // Scroll vers le formulaire
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Éditer un service
const editService = (service: any) => {
  isEditing.value = true;
  form.value = { ...service };
  activeTab.value = 'general';
  // Scroll vers le formulaire
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Annuler l'édition
const cancelEdit = () => {
  isEditing.value = false;
  form.value = {
    id: null,
    title: '',
    description: '',
    contenu: '',
    icon: '',
    image: '',
    link: '',
    color: '#3B82F6',
    tags: '',
    created_at: '',
    updated_at: '',
    deleted_at: '',
    deleted: false,
    deleted_by: ''
  };
  activeTab.value = 'general';
};

// Sauvegarder le service
const saveService = async () => {
  if (!form.value.title || !form.value.description || !form.value.icon) {
    alert('Veuillez remplir tous les champs obligatoires (Titre, Description, Icône)');
    return;
  }

  try {
    if (isEditing.value) {
      // Mise à jour
      await $fetch(`/api/services/${form.value.id}`, {
        method: 'PUT',
        body: JSON.stringify(form.value),
      });
    } else {
      // Ajout
      await $fetch('/api/services', {
        method: 'POST',
        body: JSON.stringify(form.value),
      });
    }
    cancelEdit();
    await fetchServices();
  } catch (err) {
    console.error("Erreur lors de la sauvegarde du service:", err);
    alert('Erreur lors de la sauvegarde');
  }
};

// Supprimer un service
const deleteService = async (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
    try {
      await $fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });
      await fetchServices();
    } catch (err) {
      console.error("Erreur lors de la suppression du service:", err);
      alert('Erreur lors de la suppression');
    }
  }
};

// Formater les dates
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('fr-FR');
};

// Charger les services au montage
onMounted(() => {
  fetchServices();
});
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>