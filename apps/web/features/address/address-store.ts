// ============================================================
// ADDRESS STORE — Zustand
// Handles delivery addresses, selection, and management
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DeliveryAddress } from '@/types';
import { MOCK_ADDRESSES } from '@/lib/mock-data';

interface AddressState {
  addresses: DeliveryAddress[];
  selectedAddressId: string;
  selectAddress: (id: string) => void;
  addAddress: (address: Omit<DeliveryAddress, 'id'>) => DeliveryAddress;
  updateAddress: (id: string, updates: Partial<DeliveryAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: MOCK_ADDRESSES,
      selectedAddressId: MOCK_ADDRESSES[0]?.id ?? '',

      selectAddress: (id: string) => set({ selectedAddressId: id }),

      addAddress: (newAddr) => {
        const id = `addr_${Date.now()}`;
        const created: DeliveryAddress = { ...newAddr, id };

        set((state) => {
          let updatedList = [...state.addresses];
          if (created.isDefault) {
            updatedList = updatedList.map((a) => ({ ...a, isDefault: false }));
          }
          return {
            addresses: [created, ...updatedList],
            selectedAddressId: created.id,
          };
        });

        return created;
      },

      updateAddress: (id, updates) => {
        set((state) => {
          let updatedList = state.addresses.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          );
          if (updates.isDefault) {
            updatedList = updatedList.map((a) =>
              a.id === id ? a : { ...a, isDefault: false }
            );
          }
          return { addresses: updatedList };
        });
      },

      deleteAddress: (id) => {
        set((state) => {
          const remaining = state.addresses.filter((a) => a.id !== id);
          const nextSelected =
            state.selectedAddressId === id
              ? remaining[0]?.id ?? ''
              : state.selectedAddressId;
          return { addresses: remaining, selectedAddressId: nextSelected };
        });
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
          selectedAddressId: id,
        }));
      },
    }),
    {
      name: 'agritrade_delivery_addresses',
    }
  )
);
