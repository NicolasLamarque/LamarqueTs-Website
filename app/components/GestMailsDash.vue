<template>
  <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- En-tête -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <i class="fas fa-envelope text-sky-500 text-2xl"></i>
            <div>
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
                Messages de Contact
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Gestion sécurisée de vos messages cryptés
              </p>
            </div>
          </div>
          <button
            @click="refreshAll"
            :disabled="loading"
            class="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50"
          >
            <i :class="['fas fa-sync', { 'fa-spin': loading }]"></i>
            Actualiser
          </button>
        </div>
      </div>

      <!-- Messages d'alerte -->
      <div
        v-if="message"
        :class="[
          'p-4 rounded-lg mb-6 animate-fade-in',
          message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        ]"
      >
        {{ message.text }}
      </div>

      <!-- Statistiques globales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Total messages
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ stats.total }}
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-envelope text-blue-500 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Non lus
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ stats.unread }}
              </p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-exclamation-circle text-yellow-500 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Cryptés
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ stats.encrypted }}
              </p>
            </div>
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-lock text-green-500 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Urgents
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ stats.urgent }}
              </p>
            </div>
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <i class="fas fa-fire text-red-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres et recherche -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher par nom, email..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <select
            v-model="filterStatus"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="all">Tous les statuts</option>
            <option value="new">Nouveaux</option>
            <option value="read">Lus</option>
            <option value="replied">Répondus</option>
            <option value="archived">Archivés</option>
          </select>
          <select
            v-model="filterPriority"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="all">Toutes priorités</option>
            <option value="urgent">Urgent</option>
            <option value="high">Haute</option>
            <option value="normal">Normale</option>
          </select>
        </div>
      </div>

      <!-- Liste des messages -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            Messages ({{ filteredMessages.length }})
          </h3>
        </div>

        <div v-if="loading" class="p-12 text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-500 dark:text-gray-400">
            Chargement des messages...
          </p>
        </div>

        <div v-else-if="filteredMessages.length === 0" class="p-12 text-center">
          <i class="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-500 dark:text-gray-400">
            Aucun message trouvé
          </p>
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="msg in filteredMessages"
            :key="msg.id"
            class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            @click="viewMessage(msg)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <!-- Avatar -->
                  <div class="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <i class="fas fa-user text-sky-500"></i>
                  </div>
                  
                  <!-- Info expéditeur -->
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                        {{ msg.sender_name }}
                      </h4>
                      
                      <!-- Badge statut -->
                      <span
                        :class="getStatusBadgeClass(msg.status)"
                        class="px-2 py-1 text-xs font-semibold rounded-full"
                      >
                        {{ getStatusLabel(msg.status) }}
                      </span>
                      
                      <!-- Badge priorité -->
                      <span
                        v-if="msg.priority !== 'normal'"
                        :class="getPriorityBadgeClass(msg.priority)"
                        class="px-2 py-1 text-xs font-semibold rounded-full"
                      >
                        {{ getPriorityLabel(msg.priority) }}
                      </span>
                      
                      <!-- Badge crypté -->
                      <span
                        v-if="msg.encrypted"
                        class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        <i class="fas fa-lock mr-1"></i>Crypté
                      </span>
                    </div>
                    
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ msg.sender_email }}
                    </p>
                  </div>
                </div>
                
                <!-- Aperçu du message -->
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                  {{ msg.encrypted ? '🔒 Message crypté - Cliquez pour décrypter' : msg.message }}
                </p>
                
                <!-- Métadonnées -->
                <div class="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    <i class="fas fa-clock mr-1"></i>
                    {{ formatDate(msg.created_at) }}
                  </span>
                  <span v-if="msg.category">
                    <i class="fas fa-tag mr-1"></i>
                    {{ msg.category }}
                  </span>
                  <span v-if="msg.assigned_to">
                    <i class="fas fa-user-check mr-1"></i>
                    Assigné à {{ msg.assigned_to }}
                  </span>
                </div>
              </div>
              
              <!-- Actions rapides -->
              <div class="flex items-center gap-2 ml-4">
                <button
                  @click.stop="markAsRead(msg)"
                  v-if="msg.status === 'new'"
                  class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                  title="Marquer comme lu"
                >
                  <i class="fas fa-check"></i>
                </button>
                <button
                  @click.stop="archiveMessage(msg)"
                  class="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  title="Archiver"
                >
                  <i class="fas fa-archive"></i>
                </button>
                <button
                  @click.stop="deleteMessage(msg)"
                  class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de détails du message -->
      <div
        v-if="showModal && selectedMessage"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                Message de {{ selectedMessage.sender_name }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ selectedMessage.sender_email }}
              </p>
            </div>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <div class="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
            <div class="space-y-6">
              <!-- Informations -->
              <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-500 dark:text-gray-400">Date:</span>
                    <span class="ml-2 text-gray-900 dark:text-white font-medium">
                      {{ formatDate(selectedMessage.created_at) }}
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-500 dark:text-gray-400">Statut:</span>
                    <span class="ml-2 text-gray-900 dark:text-white font-medium">
                      {{ getStatusLabel(selectedMessage.status) }}
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-500 dark:text-gray-400">Priorité:</span>
                    <span class="ml-2 text-gray-900 dark:text-white font-medium">
                      {{ getPriorityLabel(selectedMessage.priority) }}
                    </span>
                  </div>
                  <div>
                    <span class="text-gray-500 dark:text-gray-400">Catégorie:</span>
                    <span class="ml-2 text-gray-900 dark:text-white font-medium">
                      {{ selectedMessage.category }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Message décrypté -->
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  Message
                  <span v-if="selectedMessage.encrypted" class="text-sm font-normal text-green-600 dark:text-green-400">
                    <i class="fas fa-lock"></i> Décrypté
                  </span>
                </h4>
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {{ decryptedMessage || selectedMessage.message }}
                  </p>
                </div>
              </div>

              <!-- Historique des réponses -->
              <div v-if="selectedMessage.reply_history && selectedMessage.reply_history.length > 0">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Historique des réponses
                </h4>
                <div class="space-y-3">
                  <div
                    v-for="(reply, idx) in selectedMessage.reply_history"
                    :key="idx"
                    class="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg"
                  >
                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {{ reply.date }} - {{ reply.author }}
                    </p>
                    <p class="text-gray-800 dark:text-gray-200">
                      {{ reply.content }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Zone de réponse -->
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Répondre
                </h4>
                <textarea
                  v-model="replyText"
                  rows="4"
                  placeholder="Votre réponse..."
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="flex justify-between gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <div class="flex gap-2">
              <button
                @click="updateStatus('read')"
                class="px-4 py-2 text-blue-600 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
              >
                <i class="fas fa-check mr-2"></i>Marquer lu
              </button>
              <button
                @click="updateStatus('archived')"
                class="px-4 py-2 text-gray-600 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <i class="fas fa-archive mr-2"></i>Archiver
              </button>
            </div>
            <div class="flex gap-2">
              <button
                @click="closeModal"
                class="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
              <button
                @click="sendReply"
                :disabled="!replyText.trim()"
                class="px-5 py-2.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-paper-plane mr-2"></i>Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Types
interface ContactMessage {
  id: number;
  sender_name: string;
  sender_email: string;
  message: string;
  encrypted: boolean;
  encryption_algo?: string;
  category: string;
  priority: string;
  status: string;
  assigned_to?: string;
  reply_history?: any[];
  mail_log?: any[];
  deleted: boolean;
  created_at: string;
  updated_at?: string;
}

interface Message {
  text: string;
  type: 'success' | 'error';
}

// État
const messages = ref<ContactMessage[]>([]);
const loading = ref(false);
const message = ref<Message | null>(null);
const searchQuery = ref('');
const filterStatus = ref('all');
const filterPriority = ref('all');
const showModal = ref(false);
const selectedMessage = ref<ContactMessage | null>(null);
const decryptedMessage = ref('');
const replyText = ref('');

// Statistiques
const stats = computed(() => ({
  total: messages.value.length,
  unread: messages.value.filter(m => m.status === 'new').length,
  encrypted: messages.value.filter(m => m.encrypted).length,
  urgent: messages.value.filter(m => m.priority === 'urgent' || m.priority === 'high').length
}));

// Messages filtrés
const filteredMessages = computed(() => {
  let filtered = messages.value;

  // Recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(m =>
      m.sender_name.toLowerCase().includes(query) ||
      m.sender_email.toLowerCase().includes(query) ||
      m.message.toLowerCase().includes(query)
    );
  }

  // Filtre statut
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(m => m.status === filterStatus.value);
  }

  // Filtre priorité
  if (filterPriority.value !== 'all') {
    filtered = filtered.filter(m => m.priority === filterPriority.value);
  }

  return filtered.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
});

// Fonctions utilitaires
const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '-';
  }
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    new: 'Nouveau',
    read: 'Lu',
    replied: 'Répondu',
    archived: 'Archivé'
  };
  return labels[status] || status;
};

const getStatusBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    new: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    read: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    replied: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  };
  return classes[status] || classes.read;
};

const getPriorityLabel = (priority: string): string => {
  const labels: Record<string, string> = {
    urgent: 'Urgent',
    high: 'Haute',
    normal: 'Normale'
  };
  return labels[priority] || priority;
};

const getPriorityBadgeClass = (priority: string): string => {
  const classes: Record<string, string> = {
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    normal: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  };
  return classes[priority] || classes.normal;
};

const showMessage = (text: string, type: 'success' | 'error') => {
  message.value = { text, type };
  setTimeout(() => {
    message.value = null;
  }, 5000);
};

// Actions API
const fetchMessages = async () => {
  loading.value = true;
  try {
    const response = await $fetch<ContactMessage[]>('/api/contact/messages');
    messages.value = response || [];
    showMessage('Messages chargés avec succès', 'success');
  } catch (error) {
    console.error('Erreur:', error);
    showMessage('Erreur lors du chargement des messages', 'error');
  } finally {
    loading.value = false;
  }
};

const viewMessage = async (msg: ContactMessage) => {
  selectedMessage.value = msg;
  showModal.value = true;
  
  // Décrypter si nécessaire
  if (msg.encrypted) {
    try {
      const response = await $fetch<{ message: string }>(`/api/contact/messages/${msg.id}`);
      decryptedMessage.value = response.message;
    } catch (error) {
      console.error('Erreur décryptage:', error);
      showMessage('Erreur lors du décryptage du message', 'error');
    }
  }
  
  // Marquer comme lu automatiquement
  if (msg.status === 'new') {
    await markAsRead(msg);
  }
};

const markAsRead = async (msg: ContactMessage) => {
  try {
    await $fetch(`/api/contact/messages/${msg.id}`, {
      method: 'PATCH',
      body: { status: 'read' }
    });
    msg.status = 'read';
    showMessage('Message marqué comme lu', 'success');
  } catch (error) {
    console.error('Erreur:', error);
    showMessage('Erreur lors de la mise à jour', 'error');
  }
};

const updateStatus = async (status: string) => {
  if (!selectedMessage.value) return;
  
  try {
    await $fetch(`/api/contact/messages/${selectedMessage.value.id}`, {
      method: 'PATCH',
      body: { status }
    });
    selectedMessage.value.status = status;
    const msg = messages.value.find(m => m.id === selectedMessage.value!.id);
    if (msg) msg.status = status;
    showMessage(`Statut mis à jour: ${getStatusLabel(status)}`, 'success');
  } catch (error) {
    console.error('Erreur:', error);
    showMessage('Erreur lors de la mise à jour', 'error');
  }
};

const archiveMessage = async (msg: ContactMessage) => {
  try {
    await $fetch(`/api/contact/messages/${msg.id}`, {
      method: 'PATCH',
      body: { status: 'archived' }
    });
    msg.status = 'archived';
    showMessage('Message archivé', 'success');
  } catch (error) {
    console.error('Erreur:', error);
    showMessage('Erreur lors de l\'archivage', 'error');
  }
};

const deleteMessage = async (msg: ContactMessage) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;
  
  try {
    await $fetch(`/api/contact/messages/${msg.id}`, {
      method: 'DELETE'
    });
    messages.value = messages.value.filter(m => m.id !== msg.id);
    showMessage('Message supprimé', 'success');
  } catch (error) {
    console.error('Erreur:', error);
    showMessage('Erreur lors de la suppression', 'error');
  }
};

const sendReply = async () => {
  if (!selectedMessage.value || !replyText.value.trim()) return;
  
  try {
    await $fetch(`/api/contact/messages/${selectedMessage.value.id}/reply`, {
      method: 'POST',
      body: { reply: replyText.value }
    });
    
    showMessage('Réponse envoyée avec succès', 'success');
    replyText.value = '';
    await updateStatus('replied');
    closeModal();
  } catch (error) {
    console.error('Erreur:', error);
    showMessage('Erreur lors de l\'envoi de la réponse', 'error');
  }
};

const closeModal = () => {
  showModal.value = false;
  selectedMessage.value = null;
  decryptedMessage.value = '';
  replyText.value = '';
};

const refreshAll = () => {
  fetchMessages();
};

// Lifecycle
onMounted(() => {
  fetchMessages();
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>