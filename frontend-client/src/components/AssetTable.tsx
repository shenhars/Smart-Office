import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography 
} from '@mui/material';

interface Asset {
  id?: string;
  name: string;
  type: string;
}

interface AssetTableProps {
  assets: Asset[];
}

export const AssetTable: React.FC<AssetTableProps> = ({ assets }) => {
  if (assets.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
        <Typography color="textSecondary">No assets found in the office.</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table sx={{ minWidth: 650 }} aria-label="office assets table">
        <TableHead sx={{ backgroundColor: '#1976d2' }}>
          <TableRow>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Asset Name</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {asset.name}
              </TableCell>
              <TableCell>{asset.type}</TableCell>
              <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'gray' }}>
                {asset.id}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};