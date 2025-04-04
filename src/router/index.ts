import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/HomePage.vue";
import EquipmentDetail from "@/pages/EquipmentDetail.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "Home", component: HomePage },
    {
      path: "/equipment/:id",
      name: "EquipmentDetail",
      component: EquipmentDetail,
    },
  ],
});

export default router;
