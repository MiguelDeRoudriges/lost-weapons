<template lang="pug">
button.btn.btn-primary.btn-lg.mb-4(type='button' data-bs-toggle='modal' data-bs-target='#connectionModal') Отримати консультацію
#connectionModal.modal.fade(tabindex='-1' aria-labelledby='connectionModalLabel' aria-hidden='true')
  .modal-dialog.modal-dialog-centered.modal-dialog-scrollable
    .modal-content
      .modal-header
        h1.modal-title.fs-5#connectionModalLabel Заявка на корпоративне підключення
        button.btn-close(type='button' data-bs-dismiss='modal' aria-label='Close')
      .modal-body.p-4
        form.info(@submit.prevent="onSubmit", ref="connectionForm",)
          .mb-3(v-for="field in fields" :key="field.name")
            .text-start
              label.form-label(:for="field.name+'Input'") {{ field.placeholder }}
            input.form-control(
              :placeholder="field.placeholder", 
              :id="field.name+'Input'", 
              :type="field.type", 
              :name="field.name"
              :ref="field.name"
              )
          .p-2
          .text-center
            button-spinner.btn.btn-primary(type="submit", :disabled="loading") Отримати доступ
          .small.text-muted.pt-4.text-center
            | Цей сайт під захистом реКапча, до нього застосовуються 
            a.link-body-emphasis.opacity-50(href='https://policies.google.com/privacy') політика конфіденційності 
            | та 
            a.link-body-emphasis.opacity-50(href='https://policies.google.com/terms') умови використання 
            | сервісів Гугл
</template>

<script>
import ButtonSpinner from "@/components/ButtonSpinner.vue";

export default {
  components: {
    ButtonSpinner,
  },
  async mounted() {
    await import("bootstrap/js/dist/modal");
  },
  data() {
    return {
      loading: false,
      fields: [
        {
          name: "name",
          type: "text",
          placeholder: "Ім'я",
          model: "",
        },
        {
          name: "email",
          type: "email",
          placeholder: "Е-маіл",
          model: "",
        },
        {
          name: "phone",
          type: "text",
          placeholder: "Телефон",
          model: "",
        },
        {
          name: "company",
          type: "text",
          placeholder: "Компанія",
          model: "",
        },
      ],
    };
  },
  methods: {
    onSubmit() {
      this.loading = true;

      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
  },
};
</script>
