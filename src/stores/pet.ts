import { defineStore } from "pinia";
import { Pet } from "@/types/pet";
import { Plan } from "@/types/plan";

const STORAGE_KEY_PET_LIST = "pet_list";

export const usePetStore = defineStore("pet", {
  state: () => {
    return {
      petList: [] as Array<Pet>,
    };
  },
  getters: {
    newId(): string {
      if (this.petList.length > 0) {
        const lastIndex = this.petList.length - 1;
        const lastPetId = this.petList[lastIndex].id;
        if (lastPetId) {
          return (Number.parseInt(lastPetId) + 1).toString();
        }
      }
      return "1";
    },
  },
  actions: {
    initPetList(): void {
      this.petList = uni.getStorageSync(STORAGE_KEY_PET_LIST) || [];
    },
    getPetById(id: string): Pet | undefined {
      const pet = this.petList.find((pet) => pet.id === id);
      if (pet) {
        return { ...pet };
      } else {
        return undefined;
      }
    },
    deletePetByIndex(index: number): void {
      this.petList.splice(index, 1);
      this.savePetListToStorage();
    },
    deletePetById(id: string): void {
      this.petList = this.petList.filter((pet) => pet.id !== id);
      this.savePetListToStorage();
    },
    addPetToLast(pet: Pet): void {
      // 递增 pet id
      pet.id = "1";
      if (this.petList.length > 0) {
        const lastIndex = this.petList.length - 1;
        const lastPetId = this.petList[lastIndex].id;
        if (lastPetId) {
          pet.id = (Number.parseInt(lastPetId) + 1).toString();
        }
      }
      this.petList.push(pet);
      this.savePetListToStorage();
    },
    editPetById(id: string, newPet: Pet): void {
      this.petList.forEach((pet) => {
        if (pet.id === id) {
          Object.assign(pet, newPet);
          this.savePetListToStorage();
          return;
        }
      });
    },
    setPetList(petList: Array<Pet>): void {
      this.petList = petList;
      this.savePetListToStorage();
    },
    getPetPlanById(petId: string, planId: string): Plan | undefined {
      let plan = undefined;
      const pet = this.getPetById(petId);
      if (pet && pet.plans) {
        plan = pet.plans.find((plan) => plan.id === planId);
      }
      return plan;
    },
    addPetPlanById(petId: string, plan: Plan): void {
      this.petList.forEach((pet) => {
        if (pet.id === petId) {
          // 递增 plan id
          if (pet.plans && pet.plans.length) {
            const lastIndex = pet.plans.length - 1;
            const lastPlanId = pet.plans[lastIndex].id;

            if (lastPlanId) {
              const id = parseInt(lastPlanId.split("-")[1]) + 1;
              plan.id = `${petId}-${id}`;
            }
          } else {
            pet.plans = [];
            plan.id = `${petId}-1`;
          }

          pet.plans.push(plan);
          this.savePetListToStorage();
          return;
        }
      });
    },
    deletePetPlanById(petId: string, planId: string): void {
      this.petList.forEach((pet) => {
        if (pet.id === petId) {
          pet.plans = pet.plans.filter((plan) => plan.id !== planId);
          this.savePetListToStorage();
          return;
        }
      });
    },
    completePetPlanById(petId: string, planId: string): void {
      const plan = this.getPetPlanById(petId, planId);
      if (plan) {
        plan.isComplete = true;
        this.savePetListToStorage();
      }
    },
    savePetListToStorage(): void {
      uni.setStorageSync(STORAGE_KEY_PET_LIST, this.petList);
    },
  },
});
