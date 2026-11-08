<script setup>
const terms=[['Вы выбираете рекламу','Принимайте только те предложения, которые подходят вашему каналу.'],['Вы задаёте стоимость','Комиссия сервиса добавляется к цене для рекламодателя.'],['Выплата после приёмки','Следите за статусом выплаты и документами в кабинете.'],['Маркировка в процессе','Сервис получает erid и добавляет маркировку к посту.']]
</script>
<template><section id="terms" class="slice"><div class="wrap"><h2>Понятные условия.<br>Спокойная работа.</h2><div class="grid"><article v-for="([title,copy],i) in terms" :key="title"><small>0{{ i+1 }}</small><h3>{{ title }}</h3><p>{{ copy }}</p></article></div></div></section></template>
<style scoped lang="scss">
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:40px}article{padding:20px;border:1px solid var(--rule);border-radius:12px}small{color:var(--accent)}h3{font-size:24px;margin-top:20px}@media(max-width:55rem){.grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:48rem){.grid{grid-template-columns:1fr;margin-top:20px}h3{margin-top:10px}}
</style>
