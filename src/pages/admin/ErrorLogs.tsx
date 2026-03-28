import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { errorLogsData } from 'data/adminMockData';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Error ID', width: 110, sortable: false },
  { field: 'date', headerName: 'Date / Time', flex: 1, minWidth: 160 },
  { field: 'user', headerName: 'User Email', flex: 1, minWidth: 200 },
  { field: 'platform', headerName: 'Platform', width: 120, align: 'center', headerAlign: 'center' },
  { field: 'error', headerName: 'Error Message', flex: 1.5, minWidth: 220 },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams) => {
      const isResolved = params.value === 'Resolved';
      return (
        <Chip
          label={params.value as string}
          color={isResolved ? 'success' : 'warning'}
          size="small"
          sx={{ minWidth: 95, fontWeight: 600 }}
        />
      );
    },
  },
];

const ErrorLogs = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return errorLogsData;
    const q = searchQuery.toLowerCase();
    return errorLogsData.filter(
      (log) =>
        log.id.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.platform.toLowerCase().includes(q) ||
        log.error.toLowerCase().includes(q) ||
        log.status.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" mb={1}>
        System Error Logs
      </Typography>
      <Typography variant="body2" color="text.disabled" mb={3}>
        Monitor failed uploads and platform API issues.
      </Typography>

      {/* Search Bar */}
      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by error ID, email, platform, or message..."
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
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
      </Paper>

      {/* Data Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <DataGrid
          rows={filteredLogs}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          disableColumnMenu
          autoHeight
          rowHeight={56}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'info.lighter',
            },
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default ErrorLogs;
