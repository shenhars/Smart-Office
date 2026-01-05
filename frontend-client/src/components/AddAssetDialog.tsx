import { observer } from "mobx-react-lite";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { assetStore } from "../stores/AssetStore";
import { useState } from "react";

export const AddAssetDialog = observer(() => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  return (
    <Dialog open={assetStore.isAddDialogOpen} onClose={() => assetStore.setAddDialogOpen(false)}>
      <DialogTitle>Add New Office Asset</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <TextField label="Asset Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Type (e.g. Desk, Room)" fullWidth value={type} onChange={(e) => setType(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => assetStore.setAddDialogOpen(false)}>Cancel</Button>
        <Button variant="contained" onClick={() => assetStore.addAsset(name, type)}>Save Asset</Button>
      </DialogActions>
    </Dialog>
  );
});