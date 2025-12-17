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
  deleted_at?: string
  deleted_by?: string
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
const showDeleted = ref(false)
const showFilters = ref(false) // Pour toggle mobile

// Statistiques
const stats = computed(() => {
  const activeMessages = showDeleted.value 
    ? messages.value 
    : messages.value.filter(m => !m.deleted)
  
  return {
    total: activeMessages.length,
    unread: activeMessages.filter(m => m.status === 'new').length,
    urgent: activeMessages.filter(m => m.priority === 'high' || m.priority === 'urgent').length,
    encrypted: activeMessages.filter(m => m.encrypted).length,
    deleted: messages.value.filter(m => m.deleted).length
  }
})

// Messages filtrés
const filteredMessages = computed(() => {
  let filtered = [...messages.value]

  if (!showDeleted.value) {
    filtered = filtered.filter(m => !m.deleted)
  }

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

  if (msg.encrypted) {
    try {
      const data = await $fetch<ContactMessage>(`/api/mail/${msg.id}`)
      decryptedMessage.value = data.message
    } catch (error) {
      console.error('Erreur décryptage:', error)
      showNotification('Erreur décryptage', 'error')
    }
  }

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
    const msg = messages.value.find(m => m.id === id)
    if (msg) {
      msg.deleted = true
      msg.deleted_at = new Date().toISOString()
    }
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

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      
      <!-- Notification -->
      <Transition name="slide">
        <div v-if="notification" 
             :class="['fixed top-4 right-4 left-4 sm:left-auto sm:right-4 px-4 sm:px-6 py-3 rounded-lg shadow-lg z-50', notification.type === 'success' ? 'bg-green-500' : 'bg-red-500', 'text-white']">
          {{ notification.text }}
        </div>
      </Transition>

      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div class="flex items-center gap-3 sm:gap-4">
            <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="fas fa-envelope text-white text-xl sm:text-2xl"></i>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Gestion centralisée des contacts</p>
            </div>
          </div>
          <button @click="fetchMessages" :disabled="loading"
                  class="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm sm:text-base">
            <i :class="['fas fa-sync', loading ? 'fa-spin' : '']"></i>
            {{ loading ? 'Chargement...' : 'Actualiser' }}
          </button>
        </div>

        <!-- Stats Cards - Grid responsive -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-3 sm:p-4 rounded-xl">
            <div class="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div class="w-full">
                <p class="text-xs sm:text-sm text-blue-600 dark:text-blue-300 font-medium">Total</p>
                <p class="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-white">{{ stats.total }}</p>
              </div>
              <i class="fas fa-inbox text-blue-500 opacity-50 text-2xl sm:text-4xl hidden sm:block"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 p-3 sm:p-4 rounded-xl">
            <div class="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div class="w-full">
                <p class="text-xs sm:text-sm text-yellow-600 dark:text-yellow-300 font-medium">Non lus</p>
                <p class="text-2xl sm:text-3xl font-bold text-yellow-900 dark:text-white">{{ stats.unread }}</p>
              </div>
              <i class="fas fa-exclamation-circle text-yellow-500 opacity-50 text-2xl sm:text-4xl hidden sm:block"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 p-3 sm:p-4 rounded-xl">
            <div class="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div class="w-full">
                <p class="text-xs sm:text-sm text-red-600 dark:text-red-300 font-medium">Urgents</p>
                <p class="text-2xl sm:text-3xl font-bold text-red-900 dark:text-white">{{ stats.urgent }}</p>
              </div>
              <i class="fas fa-star text-red-500 opacity-50 text-2xl sm:text-4xl hidden sm:block"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-3 sm:p-4 rounded-xl">
            <div class="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div class="w-full">
                <p class="text-xs sm:text-sm text-green-600 dark:text-green-300 font-medium">Cryptés</p>
                <p class="text-2xl sm:text-3xl font-bold text-green-900 dark:text-white">{{ stats.encrypted }}</p>
              </div>
              <i class="fas fa-lock text-green-500 opacity-50 text-2xl sm:text-4xl hidden sm:block"></i>
            </div>
          </div>

          <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-3 sm:p-4 rounded-xl col-span-2 lg:col-span-1">
            <div class="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div class="w-full">
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Supprimés</p>
                <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ stats.deleted }}</p>
              </div>
              <i class="fas fa-trash text-gray-500 opacity-50 text-2xl sm:text-4xl hidden sm:block"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres et recherche - Version mobile améliorée -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <!-- Bouton toggle pour mobile -->
        <button 
          @click="showFilters = !showFilters"
          class="lg:hidden w-full flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4"
        >
          <span class="font-medium">Filtres & Recherche</span>
          <i :class="['fas', showFilters ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
        </button>

        <div :class="['flex flex-col gap-3 sm:gap-4', showFilters ? 'block' : 'hidden lg:flex']">
          <div class="w-full relative">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input v-model="searchQuery" type="text"
                   placeholder="Rechercher..."
                   class="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base">
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <select v-model="filterStatus" 
                    class="px-3 sm:px-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="all">Tous statuts</option>
              <option value="new">Nouveaux</option>
              <option value="read">Lus</option>
              <option value="replied">Répondus</option>
              <option value="archived">Archivés</option>
            </select>
            
            <select v-model="filterPriority" 
                    class="px-3 sm:px-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="all">Priorités</option>
              <option value="urgent">Urgent</option>
              <option value="high">Haute</option>
              <option value="normal">Normale</option>
            </select>
            
            <select v-model="sortBy" 
                    class="px-3 sm:px-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="date-desc">Plus récents</option>
              <option value="date-asc">Plus anciens</option>
              <option value="priority">Par priorité</option>
              <option value="name">Par nom</option>
            </select>

            <button @click="showDeleted = !showDeleted"
                    :class="['px-3 sm:px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm',
                             showDeleted 
                             ? 'bg-red-500 text-white hover:bg-red-600' 
                             : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600']">
              <i :class="['fas', showDeleted ? 'fa-eye-slash' : 'fa-trash']"></i>
              <span class="hidden sm:inline">{{ showDeleted ? 'Masquer' : 'Voir' }} supprimés</span>
              <span class="sm:hidden">{{ showDeleted ? 'Masquer' : 'Suppr.' }}</span>
              <span v-if="stats.deleted > 0" class="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                {{ stats.deleted }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des messages - Cartes sur mobile -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div class="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {{ filteredMessages.length }} message{{ filteredMessages.length > 1 ? 's' : '' }}
            <span v-if="showDeleted" class="text-sm font-normal text-red-500 ml-2">
              ({{ stats.deleted }} supprimé{{ stats.deleted > 1 ? 's' : '' }})
            </span>
          </h2>
        </div>

        <div v-if="loading" class="p-8 sm:p-12 text-center">
          <i class="fas fa-spinner fa-spin text-3xl sm:text-4xl text-gray-400 mb-4"></i>
          <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400">Chargement des messages...</p>
        </div>

        <div v-else-if="filteredMessages.length === 0" class="p-8 sm:p-12 text-center">
          <i class="fas fa-inbox text-3xl sm:text-4xl text-gray-400 mb-4"></i>
          <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400">Aucun message trouvé</p>
        </div>

        <!-- Version mobile: Cartes -->
        <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
          <div v-for="msg in filteredMessages" :key="msg.id"
               @click="openMessage(msg)"
               :class="['p-4 sm:p-6 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all cursor-pointer',
                        msg.deleted ? 'opacity-60 bg-red-50 dark:bg-red-900/10' : '']">
            <div class="flex items-start gap-3 sm:gap-4">
              <!-- Avatar -->
              <div :class="['w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0',
                            msg.deleted ? 'bg-gray-400' : 'bg-gradient-to-br from-blue-400 to-blue-600',
                            msg.status === 'new' && !msg.deleted ? 'ring-4 ring-yellow-300' : '']">
                <i :class="['text-white text-base sm:text-lg', msg.deleted ? 'fas fa-user-slash' : 'fas fa-user']"></i>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{{ msg.sender_name }}</h3>
                  
                  <div class="flex flex-wrap items-center gap-2">
                    <span v-if="msg.deleted" class="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 flex items-center gap-1">
                      <i class="fas fa-trash text-xs"></i>
                      Supprimé
                    </span>
                    
                    <span :class="['px-2 py-0.5 text-xs font-medium rounded-full', getStatusColor(msg.status)]">
                      {{ getStatusLabel(msg.status) }}
                    </span>
                    <span v-if="msg.priority !== 'normal'" :class="['px-2 py-0.5 text-xs font-medium rounded-full', getPriorityColor(msg.priority)]">
                      {{ getPriorityLabel(msg.priority) }}
                    </span>
                    <i v-if="msg.encrypted" class="fas fa-lock text-green-500 text-sm"></i>
                  </div>
                </div>
                
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">{{ msg.sender_email }}</p>
                <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">{{ msg.message }}</p>
                
                <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <span class="flex items-center gap-1">
                    <i class="fas fa-clock"></i>
                    {{ formatDate(msg.created_at) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <i class="fas fa-tag"></i>
                    {{ msg.category }}
                  </span>
                  <span v-if="msg.deleted && msg.deleted_at" class="flex items-center gap-1 text-red-500">
                    <i class="fas fa-trash"></i>
                    {{ formatDate(msg.deleted_at) }}
                  </span>
                </div>
              </div>
              
              <!-- Actions rapides (desktop uniquement) -->
              <div v-if="!msg.deleted" class="hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

      <!-- Modal de lecture - Optimisé mobile -->
      <Transition name="modal">
        <div v-if="showModal && selectedMessage"
             @click.self="closeModal"
             class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div class="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
            
            <!-- Header du modal -->
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 sm:p-6 text-white flex-shrink-0">
              <div class="flex items-start justify-between mb-3 sm:mb-4">
                <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-user text-xl sm:text-2xl"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h2 class="text-lg sm:text-2xl font-bold truncate">{{ selectedMessage.sender_name }}</h2>
                    <p class="text-sm sm:text-base text-blue-100 truncate">{{ selectedMessage.sender_email }}</p>
                  </div>
                </div>
                <button @click="closeModal" class="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0">
                  <i class="fas fa-times text-lg sm:text-xl"></i>
                </button>
              </div>
              
              <div class="flex flex-wrap items-center gap-2">
                <span v-if="selectedMessage.deleted" class="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full bg-red-500 text-white">
                  <i class="fas fa-trash mr-1"></i>
                  Supprimé
                </span>
                <span :class="['px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full bg-white/90 text-gray-700', getStatusColor(selectedMessage.status)]">
                  {{ getStatusLabel(selectedMessage.status) }}
                </span>
                <span :class="['px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full bg-white/90 text-gray-700', getPriorityColor(selectedMessage.priority)]">
                  {{ getPriorityLabel(selectedMessage.priority) }}
                </span>
                <span class="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full bg-white/20">
                  {{ selectedMessage.category }}
                </span>
                <span v-if="selectedMessage.encrypted" class="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full bg-white/20">
                  <i class="fas fa-lock text-xs sm:text-sm"></i>
                  Crypté
                </span>
              </div>
            </div>

            <!-- Corps du modal - Scrollable -->
            <div class="flex-1 overflow-y-auto p-4 sm:p-6">
              
              <!-- Informations -->
              <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-calendar text-gray-400"></i>
                    <span class="text-gray-600 dark:text-gray-400">Date:</span>
                    <span class="font-medium dark:text-white truncate">{{ formatDateFull(selectedMessage.created_at) }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="fas fa-eye text-gray-400"></i>
                    <span class="text-gray-600 dark:text-gray-400">Statut:</span>
                    <span class="font-medium dark:text-white">{{ getStatusLabel(selectedMessage.status) }}</span>
                  </div>
                  <div v-if="selectedMessage.deleted && selectedMessage.deleted_at" class="flex items-center gap-2 col-span-1 sm:col-span-2">
                    <i class="fas fa-trash text-red-400"></i>
                    <span class="text-red-600 dark:text-red-400">Supprimé le:</span>
                    <span class="font-medium text-red-600 dark:text-red-400 truncate">{{ formatDateFull(selectedMessage.deleted_at) }}</span>
                  </div>
                </div>
              </div>

              <!-- Message -->
              <div class="mb-4 sm:mb-6">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <i class="fas fa-envelope text-blue-500"></i>
                  Message
                </h3>
                <div class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 sm:p-6 shadow-sm">
                  <p class="text-sm sm:text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed break-words">{{ decryptedMessage || selectedMessage.message }}</p>
                </div>
              </div>

              <!-- Historique des réponses -->
              <div v-if="selectedMessage.reply_history && selectedMessage.reply_history.length > 0" class="mb-4 sm:mb-6">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <i class="fas fa-reply text-blue-500"></i>
                  Historique ({{ selectedMessage.reply_history.length }})
                </h3>
                <div class="space-y-3">
                  <div v-for="(reply, idx) in selectedMessage.reply_history" :key="idx"
                       class="bg-blue-50 dark:bg-blue-900 rounded-xl p-3 sm:p-4 border-l-4 border-blue-500">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
                      <span class="font-medium text-blue-900 dark:text-blue-100 text-sm sm:text-base">{{ reply.author }}</span>
                      <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{{ formatDateFull(reply.date) }}</span>
                    </div>
                    <p class="text-sm sm:text-base text-gray-700 dark:text-gray-200 break-words">{{ reply.content }}</p>
                  </div>
                </div>
              </div>

              <!-- Zone de réponse -->
              <div v-if="!selectedMessage.deleted">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <i class="fas fa-paper-plane text-blue-500"></i>
                  Répondre
                </h3>
                <textarea v-model="replyText"
                          placeholder="Votre réponse..."
                          rows="4"
                          class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"></textarea>
              </div>
              <div v-else class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 sm:p-4">
                <div class="flex items-center gap-3">
                  <i class="fas fa-exclamation-triangle text-red-500 text-lg sm:text-xl"></i>
                  <p class="text-sm sm:text-base text-red-700 dark:text-red-300">
                    Ce message a été supprimé. Vous ne pouvez plus y répondre.
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer du modal - Fixed -->
            <div class="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
              <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                <div class="flex flex-wrap gap-2">
                  <button v-if="!selectedMessage.deleted" @click="updateStatus('archived')"
                          class="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                    <i class="fas fa-archive"></i>
                    Archiver
                  </button>
                  <button v-if="!selectedMessage.deleted" @click="deleteMessageAndClose()"
                          class="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-700 bg-white dark:bg-gray-700 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors flex items-center justify-center gap-2">
                    <i class="fas fa-trash"></i>
                    Supprimer
                  </button>
                </div>
                <div class="flex gap-2 sm:gap-3">
                  <button @click="closeModal"
                          class="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                    Fermer
                  </button>
                  <button v-if="!selectedMessage.deleted" @click="sendReply"
                          :disabled="!replyText.trim()"
                          class="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    <i class="fas fa-paper-plane"></i>
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

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

.modal-enter-from > div,
.modal-leave-to > div {
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .modal-enter-from > div,
  .modal-leave-to > div {
    transform: scale(0.95) translateY(0);
  }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Amélioration du scroll sur mobile */
@supports (-webkit-overflow-scrolling: touch) {
  .overflow-y-auto {
    -webkit-overflow-scrolling: touch;
  }
}
</style>