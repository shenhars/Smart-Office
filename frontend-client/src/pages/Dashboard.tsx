import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Typography, Button, Box } from '@mui/material';
import { assetStore } from '../stores/AssetStore';
import { authStore } from '../stores/AuthStore';
import { AssetTable } from '../components/AssetTable';
import { AddAssetDialog } from '../components/AddAssetDialog';

const Dashboard = observer(() => {
  useEffect(() => {
  // Only fetch if we actually have a token to send!
  if (authStore.isAuthenticated && authStore.token) {
    assetStore.fetchAssets();
  }
}, [authStore.isAuthenticated]); // Re-run when login status changes

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Smart Office Dashboard</Typography>
        <Box>
          {authStore.userRole === 'Admin' && (
            <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => assetStore.setAddDialogOpen(true)}>
              Add Asset
            </Button>
          )}
          <Button variant="outlined" color="secondary" onClick={() => authStore.logout()}>
            Logout
          </Button>
        </Box>
      </Box>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>Office Assets</Typography>
        <AssetTable assets={assetStore.assets} />
      </Box>

      <AddAssetDialog />
    </Container>
  );
});

export default Dashboard;