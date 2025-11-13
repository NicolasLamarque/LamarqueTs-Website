<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
    <div class="max-w-7xl mx-auto">
      
      <!-- Notification -->
      <Transition name="slide">
        <div v-if="notification" 
             :class="['fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50', notification.type === 'success' ? 'bg-green-500' : 'bg-red-500', 'text-white']">
          {{ notification.text }}
        </div>
      </Transition>

      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="fas fa-envelope text-white text-2xl"></i>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Gestion centralisée des contacts</p>
            </div>
          </div>
          <button @click="fetchMessages" :disabled="loading"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
            <i :class="['fas fa-sync', loading ? 'fa-spin' : '']"></i>
            {{ loading ? 'Chargement...' : 'Actualiser' }}
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-xl">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-600 dark:text-blue-300 font-medium">Total</p>
                <p class="text-3xl font-bold text-blue-900 dark:text-white">{{ stats.total }}</p>
              </div>
              <i class="fas fa-inbox text-blue-500 opacity-50 text-4xl"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 p-4 rounded-xl">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-yellow-600 dark:text-yellow-300 font-medium">Non lus</p>
                <p class="text-3xl font-bold text-yellow-900 dark:text-white">{{ stats.unread }}</p>
              </div>
              <i class="fas fa-exclamation-circle text-yellow-500 opacity-50 text-4xl"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 p-4 rounded-xl">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-red-600 dark:text-red-300 font-medium">Urgents</p>
                <p class="text-3xl font-bold text-red-900 dark:text-white">{{ stats.urgent }}</p>
              </div>
              <i class="fas fa-star text-red-500 opacity-50 text-4xl"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-xl">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-green-600 dark:text-green-300 font-medium">Cryptés</p>
                <p class="text-3xl font-bold text-green-900 dark:text-white">{{ stats.encrypted }}</p>
              </div>
              <i class="fas fa-lock text-green-500 opacity-50 text-4xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres et recherche -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
        <div class="flex flex-col md:flex-row flex-wrap gap-4">
          <div class="flex-1 min-w-[300px] relative">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input v-model="searchQuery" type="text"
                   placeholder="Rechercher par nom, email, message..."
                   class="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
          
          <select v-model="filterStatus" 
                  class="px-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="all">Tous les statuts</option>
            <option value="new">Nouveaux</option>
            <option value="read">Lus</option>
            <option value="replied">Répondus</option>
            <option value="archived">Archivés</option>
          </select>
          
          <select v-model="filterPriority" 
                  class="px-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="all">Toutes priorités</option>
            <option value="urgent">Urgent</option>
            <option value="high">Haute</option>
            <option value="normal">Normale</option>
          </select>
          
          <select v-model="sortBy" 
                  class="px-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="date-desc">Plus récents</option>
            <option value="date-asc">Plus anciens</option>
            <option value="priority">Par priorité</option>
            <option value="name">Par nom</option>
          </select>
        </div>
      </div>

      <!-- Liste des messages -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ filteredMessages.length }} message{{ filteredMessages.length > 1 ? 's' : '' }}
          </h2>
        </div>

        <div v-if="loading" class="p-12 text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-500 dark:text-gray-400">Chargement des messages...</p>
        </div>

        <div v-else-if="filteredMessages.length === 0" class="p-12 text-center">
          <i class="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-500 dark:text-gray-400">Aucun message trouvé</p>
        </div>

        <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
          <div v-for="msg in filteredMessages" :key="msg.id"
               @click="openMessage(msg)"
               class="p-6 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all cursor-pointer group">
            <div class="flex items-start gap-4">
              <!-- Avatar -->
              <div :class="['w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0', msg.status === 'new' ? 'ring-4 ring-yellow-300' : '']">
                <i class="fas fa-user text-white text-lg"></i>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ msg.sender_name }}</h3>
                  <span :class="['px-2 py-0.5 text-xs font-medium rounded-full', getStatusColor(msg.status)]">
                    {{ getStatusLabel(msg.status) }}
                  </span>
                  <span v-if="msg.priority !== 'normal'" :class="['px-2 py-0.5 text-xs font-medium rounded-full', getPriorityColor(msg.priority)]">
                    {{ getPriorityLabel(msg.priority) }}
                  </span>
                  <i v-if="msg.encrypted" class="fas fa-lock text-green-500 text-sm"></i>
                </div>
                
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ msg.sender_email }}</p>
                <p class="text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">{{ msg.message }}</p>
                
                <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span class="flex items-center gap-1">
                    <i class="fas fa-clock"></i>
                    {{ formatDate(msg.created_at) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <i class="fas fa-tag"></i>
                    {{ msg.category }}
                  </span>
                </div>
              </div>
              
              <!-- Actions rapides -->
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click.stop="archiveMessage(msg.id)"
                        class="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="Archiver">
                  <i class="fas fa-archive text-gray-600 dark:text-gray-300"></i>
                </button>
                <button @click.stop="deleteMessage(msg.id)"
                        class="p-2 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                        title="Supprimer">
                  <i class="fas fa-trash text-red-600"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de lecture -->
      <Transition name="modal">
        <div v-if="showModal && selectedMessage"
             @click.self="closeModal"
             class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            
            <!-- Header du modal -->
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <i class="fas fa-user text-2xl"></i>
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold">{{ selectedMessage.sender_name }}</h2>
                    <p class="text-blue-100">{{ selectedMessage.sender_email }}</p>
                  </div>
                </div>
                <button @click="closeModal" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <i class="fas fa-times text-xl"></i>
                </button>
              </div>
              
              <div class="flex items-center gap-3 flex-wrap">
                <span :class="['px-3 py-1 text-sm font-medium rounded-full bg-white/90 text-gray-700', getStatusColor(selectedMessage.status)]">
                  {{ getStatusLabel(selectedMessage.status) }}
                </span>
                <span :class="['px-3 py-1 text-sm font-medium rounded-full bg-white/90 text-gray-700', getPriorityColor(selectedMessage.priority)]">
                  {{ getPriorityLabel(selectedMessage.priority) }}
                </span>
                <span class="px-3 py-1 text-sm font-medium rounded-full bg-white/20">
                  {{ selectedMessage.category }}
                </span>
                <span v-if="selectedMessage.encrypted" class="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-white/20">
                  <i class="fas fa-lock text-sm"></i>
                  Crypté
                </span>
              </div>
            </div>

            <!-- Corps du modal -->
            <div class="p-6 max-h-[60vh] overflow-y-auto">
              
              <!-- Informations -->
              <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-calendar text-gray-400"></i>
                    <span class="text-gray-600 dark:text-gray-400">Date:</span>
                    <span class="font-medium dark:text-white">{{ formatDateFull(selectedMessage.created_at) }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="fas fa-eye text-gray-400"></i>
                    <span class="text-gray-600 dark:text-gray-400">Statut:</span>
                    <span class="font-medium dark:text-white">{{ getStatusLabel(selectedMessage.status) }}</span>
                  </div>
                </div>
              </div>

              <!-- Message -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <i class="fas fa-envelope text-blue-500"></i>
                  Message
                </h3>
                <div class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 shadow-sm">
                  <p class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{{ decryptedMessage || selectedMessage.message }}</p>
                </div>
              </div>

              <!-- Historique des réponses -->
              <div v-if="selectedMessage.reply_history && selectedMessage.reply_history.length > 0" class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <i class="fas fa-reply text-blue-500"></i>
                  Historique ({{ selectedMessage.reply_history.length }})
                </h3>
                <div class="space-y-3">
                  <div v-for="(reply, idx) in selectedMessage.reply_history" :key="idx"
                       class="bg-blue-50 dark:bg-blue-900 rounded-xl p-4 border-l-4 border-blue-500">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-medium text-blue-900 dark:text-blue-100">{{ reply.author }}</span>
                      <span class="text-sm text-gray-600 dark:text-gray-300">{{ formatDateFull(reply.date) }}</span>
                    </div>
                    <p class="text-gray-700 dark:text-gray-200">{{ reply.content }}</p>
                  </div>
                </div>
              </div>

              <!-- Zone de réponse -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <i class="fas fa-paper-plane text-blue-500"></i>
                  Répondre
                </h3>
                <textarea v-model="replyText"
                          placeholder="Votre réponse..."
                          rows="5"
                          class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"></textarea>
              </div>
            </div>

            <!-- Footer du modal -->
            <div class="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
              <div class="flex gap-2">
                <button @click="updateStatus('archived')"
                        class="px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                  <i class="fas fa-archive"></i>
                  Archiver
                </button>
                <button @click="deleteMessageAndClose()"
                        class="px-4 py-2 text-red-700 bg-white dark:bg-gray-700 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors flex items-center gap-2">
                  <i class="fas fa-trash"></i>
                  Supprimer
                </button>
              </div>
              <div class="flex gap-3">
                <button @click="closeModal"
                        class="px-6 py-2.5 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  Fermer
                </button>
                <button @click="sendReply"
                        :disabled="!replyText.trim()"
                        class="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  <i class="fas fa-paper-plane"></i>
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Types
interface ContactMessage {
  id: number
  sender_name: string
  sender_email: string
  message: string
  encrypted: boolean
  encryption_algo?: string
  category: string
  priority: string
  status: string
  assigned_to?: string
  reply_history?: Array<{
    date: string
    author: string
    content: string
  }>
  mail_log?: any[]
  deleted: boolean
  created_at: string
  updated_at?: string
}

interface Notification {
  text: string
  type: 'success' | 'error'
}

// État
const messages = ref<ContactMessage[]>([])
const loading = ref(false)
const notification = ref<Notification | null>(null)
const searchQuery = ref('')
const filterStatus = ref('all')
const filterPriority = ref('all')
const sortBy = ref('date-desc')
const showModal = ref(false)
const selectedMessage = ref<ContactMessage | null>(null)
const decryptedMessage = ref('')
const replyText = ref('')

// Statistiques
const stats = computed(() => ({
  total: messages.value.length,
  unread: messages.value.filter(m => m.status === 'new').length,
  urgent: messages.value.filter(m => m.priority === 'high' || m.priority === 'urgent').length,
  encrypted: messages.value.filter(m => m.encrypted).length
}))

// Messages filtrés
const filteredMessages = computed(() => {
  let filtered = [...messages.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(m =>
      m.sender_name.toLowerCase().includes(query) ||
      m.sender_email.toLowerCase().includes(query) ||
      m.message.toLowerCase().includes(query)
    )
  }

  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(m => m.status === filterStatus.value)
  }

  if (filterPriority.value !== 'all') {
    filtered = filtered.filter(m => m.priority === filterPriority.value)
  }

  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'date-asc':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'priority': {
        const priorityOrder: Record<string, number> = { urgent: 3, high: 2, normal: 1 }
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
      }
      case 'name':
        return a.sender_name.localeCompare(b.sender_name)
      default:
        return 0
    }
  })

  return filtered
})

// Fonctions
const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
  notification.value = { text, type }
  setTimeout(() => notification.value = null, 3000)
}

const fetchMessages = async () => {
  loading.value = true
  try {
    const data = await $fetch<ContactMessage[]>('/api/mail')
    messages.value = data || []
    showNotification('Messages chargés avec succès', 'success')
  } catch (error) {
    console.error('Erreur:', error)
    showNotification('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const openMessage = async (msg: ContactMessage) => {
  selectedMessage.value = msg
  showModal.value = true
  decryptedMessage.value = ''

  // Décrypter si nécessaire
  if (msg.encrypted) {
    try {
      const data = await $fetch<ContactMessage>(`/api/mail/${msg.id}`)
      decryptedMessage.value = data.message
    } catch (error) {
      console.error('Erreur décryptage:', error)
      showNotification('Erreur décryptage', 'error')
    }
  }

  // Marquer comme lu
  if (msg.status === 'new') {
    await markAsRead(msg.id)
  }
}

const markAsRead = async (id: number) => {
  try {
    await $fetch(`/api/mail/${id}`, {
      method: 'PATCH',
      body: { status: 'read' }
    })
    const msg = messages.value.find(m => m.id === id)
    if (msg) msg.status = 'read'
    if (selectedMessage.value?.id === id) {
      selectedMessage.value.status = 'read'
    }
  } catch (error) {
    console.error('Erreur:', error)
  }
}

const updateStatus = async (status: string) => {
  if (!selectedMessage.value) return
  try {
    await $fetch(`/api/mail/${selectedMessage.value.id}`, {
      method: 'PATCH',
      body: { status }
    })
    selectedMessage.value.status = status
    const msg = messages.value.find(m => m.id === selectedMessage.value!.id)
    if (msg) msg.status = status
    showNotification(`Statut: ${getStatusLabel(status)}`, 'success')
    if (status === 'archived') closeModal()
  } catch (error) {
    console.error('Erreur:', error)
    showNotification('Erreur mise à jour', 'error')
  }
}

const archiveMessage = async (id: number) => {
  try {
    await $fetch(`/api/mail/${id}`, {
      method: 'PATCH',
      body: { status: 'archived' }
    })
    const msg = messages.value.find(m => m.id === id)
    if (msg) msg.status = 'archived'
    showNotification('Message archivé', 'success')
  } catch (error) {
    console.error('Erreur:', error)
    showNotification('Erreur archivage', 'error')
  }
}

const deleteMessage = async (id: number) => {
  if (!confirm('Supprimer ce message ?')) return
  try {
    await $fetch(`/api/mail/${id}`, { method: 'DELETE' })
    messages.value = messages.value.filter(m => m.id !== id)
    showNotification('Message supprimé', 'success')
  } catch (error) {
    console.error('Erreur:', error)
    showNotification('Erreur suppression', 'error')
  }
}

const deleteMessageAndClose = async () => {
  if (!selectedMessage.value) return
  await deleteMessage(selectedMessage.value.id)
  closeModal()
}

const sendReply = async () => {
  if (!selectedMessage.value || !replyText.value.trim()) return
  try {
    await $fetch(`/api/mail/${selectedMessage.value.id}/reply`, {
      method: 'POST',
      body: { reply: replyText.value }
    })
    
    const replyEntry = {
      date: new Date().toISOString(),
      author: 'Admin',
      content: replyText.value
    }
    
    selectedMessage.value.reply_history = [...(selectedMessage.value.reply_history || []), replyEntry]
    const msg = messages.value.find(m => m.id === selectedMessage.value!.id)
    if (msg) {
      msg.reply_history = selectedMessage.value.reply_history
      msg.status = 'replied'
    }
    
    replyText.value = ''
    showNotification('Réponse envoyée', 'success')
  } catch (error) {
    console.error('Erreur:', error)
    showNotification('Erreur envoi', 'error')
  }
}

const closeModal = () => {
  showModal.value = false
  selectedMessage.value = null
  decryptedMessage.value = ''
  replyText.value = ''
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / 3600000)
  
  if (hours < 1) return 'À l\'instant'
  if (hours < 24) return `Il y a ${hours}h`
  if (hours < 48) return 'Hier'
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

const formatDateFull = (dateString: string): string => {
  return new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    new: 'Nouveau',
    read: 'Lu',
    replied: 'Répondu',
    archived: 'Archivé'
  }
  return labels[status] || status
}

const getPriorityLabel = (priority: string): string => {
  const labels: Record<string, string> = {
    urgent: 'Urgent',
    high: 'Haute',
    normal: 'Normale'
  }
  return labels[priority] || priority
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    new: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    read: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    replied: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
  return colors[status] || colors.read
}

const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    normal: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
  return colors[priority] || colors.normal
}

// Lifecycle
onMounted(() => {
  fetchMessages()
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>