<template>
    <router-view />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "App",
});
</script>

<script setup>
console.log(process.env);
</script>
