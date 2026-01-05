import { makeAutoObservable, runInAction, reaction } from "mobx";
import { authStore } from "./AuthStore";
import { getAssets, addAsset as apiAddAsset } from "../api/resourceApi";

interface Asset {
  id?: string;
  name: string;
  type: string;
}

class AssetStore {
  assets: Asset[] = [];
  isAddDialogOpen = false; // Controls the MUI Dialog visibility
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    // Only fetch assets when user is authenticated. Also react to future login events.
    if (authStore.isAuthenticated) {
      this.fetchAssets();
    }

    // When auth state changes to true, fetch assets automatically
    reaction(
      () => authStore.isAuthenticated,
      (isAuth) => {
        if (isAuth) this.fetchAssets();
      }
    );
  }

  // Open/Close Dialog Actions
  setAddDialogOpen(isOpen: boolean) {
    this.isAddDialogOpen = isOpen;
  }

  // GET /assets - Accessible to all roles
  async fetchAssets() {
    this.isLoading = true;
    try {
      this.assets = await getAssets();
    } catch (err) {
      // If not authenticated, the API may return 401. Silently ignore here.
      console.warn('Unable to load assets:', err);
    } finally {
      runInAction(() => { this.isLoading = false; });
    }
  }

  // POST /assets - Restricted to Admin role
  async addAsset(name: string, type: string) {
    await apiAddAsset({ name, type });
    await this.fetchAssets(); // Refresh the list
    this.setAddDialogOpen(false); // Close the dialog
  }
}

export const assetStore = new AssetStore();