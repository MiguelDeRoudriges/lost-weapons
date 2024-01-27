<template lang="pug">
.hero
  #min-height.d-flex.flex-column
    .container
      page-header
    .p-2
    slot
  .bg-body.border-top.border-secondary-subtle
    .container-fluid.h-100.p-0
      .container.px-0(v-if="faqs")
        .p-2
        faq(id="faq", :faqs="faqs", accordionId="myAccordion", background-color="body",  v-cloak)
      page-footer.pb-0
</template>

<script>
import PageHeader from "@/components/Header.vue";
import PageFooter from "@/components/Footer.vue";
import Faq from "@/components/Faq.vue";

const faqList = [
  {
    question: "Що таке Державний реєстр загубленої зброї?",
    answers: [
      "Це реєстр, який містить інформацію про зброю, що перебуває у розшуку у зв'язку з її викраденням чи втратою.",
    ],
  },
  {
    question: "Як я можу знайти інформацію про конкретну зброю?",
    answers: [
      "Ви можете ввести серію та (або) номер зброї в пошукове поле на сайті реєстру. Наприклад, '36ЛЯ' або '531178'.",
    ],
  },
  {
    question: "Що таке API і яка інформація доступна через нього?",
    answers: [
      "API дозволяє автоматично отримувати докладну інформацію про зброю, яка знаходиться в розшуку. Через API ви можете отримати доступ до бази даних зброї, дізнатися про марку, модель, виробника, тип, вид, серію, номер, калібр, кількість стволів, рік виробництва та іншу деталізовану інформацію.",
    ],
  },
  {
    question: "Де я можу дізнатися про статус та історію конкретної зброї?",
    answers: [
      "Через API ви можете дізнатися про останні оновлення статусу зброї, дату викрадення або втрати, а також підрозділ, який здійснює розшук.",
    ],
  },
];

export default {
  components: {
    PageHeader,
    PageFooter,
    Faq,
  },
  data() {
    return {
      faqs: faqList,
    };
  },
};
</script>

<style lang="sass" scoped>
.hero
  background: linear-gradient(284.6deg, #dcddf9 10.33%, rgba(206 226 241) 75.36%)
</style>
