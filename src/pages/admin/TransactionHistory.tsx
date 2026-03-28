import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { transactionsData } from 'data/adminMockData';

const statusColors: Record<string, 'success' | 'error' | 'warning'> = {
  Success: 'success',
  Failed: 'error',
  Refunded: 'warning',
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'TXN ID', width: 110, sortable: false },
  { field: 'date', headerName: 'Date', width: 120 },
  { field: 'user', headerName: 'User', flex: 1, minWidth: 140 },
  { field: 'email', headerName: 'Email', flex: 1, minWidth: 180 },
  { field: 'plan', headerName: 'Plan', width: 110, align: 'center', headerAlign: 'center' },
  { field: 'amount', headerName: 'Amount', width: 100, align: 'center', headerAlign: 'center' },
  { field: 'method', headerName: 'Method', width: 120, align: 'center', headerAlign: 'center' },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams) => (
      <Chip
        label={params.value as string}
        color={statusColors[params.value as string] || 'default'}
        size="small"
        sx={{ minWidth: 85, fontWeight: 600 }}
      />
    ),
  },
];

const TransactionHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return transactionsData;
    const q = searchQuery.toLowerCase();
    return transactionsData.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.user.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.plan.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" mb={1}>
        Transaction History
      </Typography>
      <Typography variant="body2" color="text.disabled" mb={3}>
        All payment records across the platform.
      </Typography>

      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by TXN ID, user, email, plan, or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="ic:round-search" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          disableColumnMenu
          autoHeight
          rowHeight={56}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: 'info.lighter' },
            '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center' },
          }}
        />
      </Paper>
    </Box>
  );
};

export default TransactionHistory;
