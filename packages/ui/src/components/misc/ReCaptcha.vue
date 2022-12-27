<template>
  <VueRecaptcha
    :sitekey="siteKey"
    @verify="onVerify"
    load-recaptcha-script
    recaptchaHost="www.recaptcha.net"
  />
</template>

<script setup lang="ts">
import { VueRecaptcha } from 'vue-recaptcha'

const siteKey = import.meta.env.VITE_RECAPTCHA_KEY

const emit = defineEmits<{
  (e: 'verify', token: string): void
}>()

function onVerify(token: string): void {
  emit('verify', token)
}
</script>
