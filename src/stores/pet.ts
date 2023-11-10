import { defineStore } from "pinia";
import { Pet } from "@/types/pet";

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
    savePetListToStorage(): void {
      uni.setStorageSync(STORAGE_KEY_PET_LIST, this.petList);
    },
  },
});
