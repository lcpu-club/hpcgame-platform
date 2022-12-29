import { computed, onUnmounted, ref } from 'vue'

export function useCountdown() {
  const remaining = ref(0)
  const waiting = computed(() => remaining.value > 0)
  let intervalId: ReturnType<typeof setInterval>
  function start(seconds: number) {
    remaining.value = seconds
    intervalId = setInterval(() => {
      remaining.value--
      if (remaining.value <= 0) clearInterval(intervalId)
    }, 1000)
  }
  function stop() {
    intervalId && clearInterval(intervalId)
    remaining.value = 0
  }
  onUnmounted(stop)
  return { remaining, waiting, start, stop }
}
