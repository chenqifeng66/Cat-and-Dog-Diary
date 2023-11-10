import { defineStore } from "pinia";
import { Plan } from "@/types/plan";

const STORAGE_KEY_PLAN_LIST = "plan_list";

export const usePlanStore = defineStore("plan", {
  state: () => {
    return {
      planList: [] as Array<Plan>,
    };
  },
  getters: {
    newId(): string {
      if (this.planList.length > 0) {
        const lastIndex = this.planList.length - 1;
        const lastPlanId = this.planList[lastIndex].id;
        if (lastPlanId) {
          return (Number.parseInt(lastPlanId) + 1).toString();
        }
      }
      return "1";
    },
  },
  actions: {
    initPlanList(): void {
      this.planList = uni.getStorageSync(STORAGE_KEY_PLAN_LIST) || [];
    },
    getPlanById(id: string): Plan | undefined {
      const plan = this.planList.find((plan) => plan.id === id);
      if (plan) {
        return { ...plan };
      } else {
        return undefined;
      }
    },
    deletePlanByIndex(index: number): void {
      this.planList.splice(index, 1);
      this.savePlanListToStorage();
    },
    deletePlanById(id: string): void {
      this.planList = this.planList.filter((plan) => plan.id !== id);
      this.savePlanListToStorage();
    },
    addPlanToLast(plan: Plan): void {
      this.planList.push(plan);
      this.savePlanListToStorage();
    },
    editPlanById(id: string, newPlan: Plan): void {
      this.planList.forEach((plan) => {
        if (plan.id === id) {
          Object.assign(plan, newPlan);
          this.savePlanListToStorage();
          return;
        }
      });
    },
    setPlanList(planList: Array<Plan>): void {
      this.planList = planList;
      this.savePlanListToStorage();
    },
    savePlanListToStorage(): void {
      uni.setStorageSync(STORAGE_KEY_PLAN_LIST, this.planList);
    },
  },
});
