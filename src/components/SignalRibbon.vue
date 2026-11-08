<script setup>
const words = ['КОНТЕНТ','→','АУДИТОРИЯ','→','РЕКЛАМА','→','ДОХОД']
</script>
<template><div id="ribbon" class="ribbon"><div class="track"><div v-for="n in 2" :key="n" class="repeat" :aria-hidden="n === 2 || undefined"><span v-for="(word,i) in words" :key="i">{{ word }}</span></div></div></div></template>
<style scoped lang="scss">
.ribbon{overflow:hidden;background:var(--highlight);color:var(--ink)}.track{display:flex;width:max-content}.repeat{display:flex;align-items:center;justify-content:space-around;min-width:100vw;gap:2rem;padding:18px 2rem;font:700 clamp(18px,2.25vw,32px)/1.5 var(--font-heading);letter-spacing:.04em}@media(max-width:48rem){.repeat{padding:10px 16px;gap:22px}}
</style>
