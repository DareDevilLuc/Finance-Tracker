<script setup lang="ts">
import { RouterView } from 'vue-router';
import Card from 'primevue/card'
</script>


<template>
    <div class="summary-cards">
        <Card/>
        <Card/>
        <Card/>
    </div>

</template>


<style>
.summary-cards{
    display: grid;
    grid-template-columns: repeat(3, 1fr);

}


</style>
