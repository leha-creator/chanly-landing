<script setup>
const questions=['Кто может подключить канал?','Нужно ли публиковать пост вручную?','Можно ли отказаться от рекламы?','Когда придёт выплата?','Можно ли добавить несколько каналов?']
</script>
<template><section id="faq" class="slice"><div class="wrap split"><h2>Разберёмся.</h2><div><article v-for="(question,i) in questions" :key="question"><h3>{{ question }}<span aria-hidden="true">{{ i ? '+' : '−' }}</span></h3><p v-if="!i">Самозанятые, ИП и юридические лица — владельцы MAX-каналов. Понадобятся данные владельца, реквизиты и подключение бота.</p></article></div></div></section></template>
<style scoped lang="scss">
article{padding:14px 0;border-bottom:1px solid var(--rule);margin-bottom:10px}h3{display:flex;justify-content:space-between;gap:16px;font-size:clamp(17px,1.6vw,24px)}h3 span{color:var(--accent)}
</style>
