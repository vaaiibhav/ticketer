import { create } from "zustand";

const useTicketStore = create((set) => ({
  userToken: undefined,
  userBalance: undefined,
  userDetails: {},
  updateUserToken: (newToken) => set({ userToken: newToken }),
  updateUserBalance: (newBalance) => set({ userBalance: newBalance }),
  decreaseBalance: (reduceBy) =>
    set((state) => ({ userBalance: state.userBalance - reduceBy })),
  updateUserDetails: (newDetails) => set({ userDetails: newDetails }),
  //
  //
  // Temp
  //
  //
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}));

export default useTicketStore;
