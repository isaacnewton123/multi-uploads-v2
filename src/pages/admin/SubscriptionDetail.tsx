import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { subscriptionsData } from 'data/adminMockData';

const planChipColors: Record<string, { bg: string; text: string }> = {
  Basic: { bg: '#E3F2FD', text: '#1565C0' },
  Premium: { bg: '#FFF3E0', text: '#E65100' },
  Enterprise: { bg: '#EDE7F6', text: '#4527A0' },
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 60, sortable: false },
  { field: 'user', headerName: 'User', flex: 1, minWidth: 140 },
  { field: 'email', headerName: 'Email', flex: 1, minWidth: 180 },
  {
    field: 'plan',
    headerName: 'Plan',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams) => {
      const plan = params.value as string;
      const style = planChipColors[plan] || planChipColors.Basic;
      return (
        <Chip
          label={plan}
          size="small"
          sx={{ fontWeight: 600, bgcolor: style.bg, color: style.text, minWidth: 90 }}
        />
      );
    },
  },
  { field: 'price', headerName: 'Price', width: 90, align: 'center', headerAlign: 'center' },
  { field: 'startDate', headerName: 'Start', width: 120 },
  { field: 'endDate', headerName: 'End', width: 120 },
  {
    field: 'autoRenew',
    headerName: 'Auto Renew',
    width: 110,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams) => (
      <Chip
        label={params.value ? 'Yes' : 'No'}
        size="small"
        variant="outlined"
        sx={{
          fontWeight: 600,
          borderColor: params.value ? 'success.main' : 'error.main',
          color: params.value ? 'success.main' : 'error.main',
        }}
      />
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 110,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams) => {
      const status = params.value as string;
      const chipStyle: Record<string, { bg: string; text: string }> = {
        Active: { bg: '#E8F5E9', text: '#2E7D32' },
        Expired: { bg: '#FFEBEE', text: '#C62828' },
        Cancelled: { bg: '#FFF3E0', text: '#E65100' },
      };
      const style = chipStyle[status] || chipStyle.Cancelled;
      return (
        <Chip
          label={status}
          size="small"
          sx={{ minWidth: 85, fontWeight: 600, bgcolor: style.bg, color: style.text }}
        />
      );
    },
  },
];

const SubscriptionDetail = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return subscriptionsData;
    const q = searchQuery.toLowerCase();
    return subscriptionsData.filter(
      (s) =>
        s.user.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.plan.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" mb={1}>
        Subscription Details
      </Typography>
      <Typography variant="body2" color="text.disabled" mb={3}>
        View all user subscriptions, billing dates, and renewal status.
      </Typography>

      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by user, email, plan, or status..."
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

export default SubscriptionDetail;
