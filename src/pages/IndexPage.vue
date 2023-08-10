<template>
    <q-page class="flex flex-center">
        <img
            alt="Quasar logo"
            src="~assets/quasar-logo-vertical.svg"
            style="width: 200px; height: 200px"
        />
    </q-page>

    <form @submit.prevent="onLogin">
        <q-input
            v-model="form.email"
            label="Username"
            lazy-rules
            :rules="[(val) => !!val || 'Please enter your username']"
        />
        <q-input
            v-model="form.password"
            label="Password"
            lazy-rules
            :rules="[(val) => !!val || 'Please enter your password']"
        />
        <button type="submit">asda</button>
    </form>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "IndexPage",
});
</script>

<script setup>
import { ref, reactive } from "vue";
import useAuthenticationStore from "stores/authenticationStore";

const form = reactive({
    email: "",
    password: "",
});

const authenticationStore = useAuthenticationStore();

const onLogin = async () => {
    const { data, message } = await authenticationStore.login(form);
};
</script>
