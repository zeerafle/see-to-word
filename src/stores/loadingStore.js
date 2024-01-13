import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
  }),
  actions: {
    setLoading(isLoading) {
      this.isLoading = isLoading
    },
    getLoading() {
      return this.isLoading
    },
  },
})
