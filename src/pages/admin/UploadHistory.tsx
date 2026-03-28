import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { globalUploadsData } from 'data/adminMockData';

const statusColors: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
  Published: 'success',
  Failed: 'error',
  Processing: 'warning',
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 60, sortable: false },
  { field: 'title', headerName: 'Video Title', flex: 1.5, minWidth: 200 },
  { field: 'user', headerName: 'User', flex: 1, minWidth: 180 },
  { field: 'platform', headerName: 'Platform', width: 120, align: 'center', headerAlign: 'center' },
  { field: 'date', headerName: 'Date / Time', width: 160 },
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
        sx={{ minWidth: 90, fontWeight: 600 }}
      />
    ),
  },
];

const UploadHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return globalUploadsData;
    const q = searchQuery.toLowerCase();
    return globalUploadsData.filter(
      (u) =>
        u.title.toLowerCase().includes(q) ||
        u.user.toLowerCase().includes(q) ||
        u.platform.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" mb={1}>
        Upload History
      </Typography>
      <Typography variant="body2" color="text.disabled" mb={3}>
        All video uploads across the platform.
      </Typography>

      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by title, user, platform, or status..."
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

export default UploadHistory;
