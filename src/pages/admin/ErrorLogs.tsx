import { useState, useMemo, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import IconifyIcon from 'components/base/IconifyIcon';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

const platformIcons: Record<string, { icon: string; color: string }> = {
  youtube: { icon: 'logos:youtube-icon', color: '#FF0000' },
  facebook: { icon: 'logos:facebook', color: '#1877F2' },
  instagram: { icon: 'skill-icons:instagram', color: '#E4405F' },
  tiktok: { icon: 'ic:baseline-tiktok', color: '#000000' },
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Video ID', width: 220, sortable: false },
  { field: 'date', headerName: 'Date / Time', flex: 1, minWidth: 160 },
  { field: 'user', headerName: 'User ID', flex: 1, minWidth: 150 },
  {
    field: 'platform',
    headerName: 'Platform',
    width: 140,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams) => {
      const info = platformIcons[params.value as string] || { icon: 'mdi:help', color: '#ccc' };
      return (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" width="100%">
          <IconifyIcon icon={info.icon} sx={{ fontSize: 20, color: info.color }} />
          <Typography variant="body2" textTransform="capitalize">
            {params.value}
          </Typography>
        </Stack>
      );
    },
  },
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
          color={isResolved ? 'success' : 'error'}
          size="small"
          sx={{ minWidth: 95, fontWeight: 600 }}
        />
      );
    },
  },
];

interface ErrorLogRow {
  idRow: string;
  id: string;
  date: string;
  user: string;
  platform: string;
  error: string;
  status: string;
  searchString: string;
}

const ErrorLogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [errorLogs, setErrorLogs] = useState<ErrorLogRow[]>([]);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:4000/api/videos?limit=1000');
      const data = await res.json();
      if (data.success) {
        const rows: ErrorLogRow[] = [];
        data.data.forEach(
          (v: {
            _id: string;
            userId: string;
            createdAt: string;
            updatedAt: string;
            platforms: { platform: string; status: string; completedAt: string; error: string }[];
          }) => {
            if (v.platforms && Array.isArray(v.platforms)) {
              v.platforms.forEach((p) => {
                if (p.status === 'failed') {
                  rows.push({
                    idRow: `${v._id}-${p.platform}`, // Unique for DataGrid
                    id: v._id,
                    date: new Date(p.completedAt || v.updatedAt || v.createdAt).toLocaleString(),
                    user: v.userId || 'admin',
                    platform: p.platform,
                    error: p.error || 'Unknown upload failure',
                    status: 'Failed',
                    searchString: `${v._id} ${p.platform} ${p.error} ${v.userId}`.toLowerCase(),
                  });
                }
              });
            }
          },
        );
        setErrorLogs(rows);
      }
    } catch (e) {
      console.error('Failed to fetch error logs', e);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return errorLogs;
    const q = searchQuery.toLowerCase();
    return errorLogs.filter((log) => log.searchString.includes(q));
  }, [searchQuery, errorLogs]);

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
          placeholder="Search by Video ID, User ID, platform, or error message..."
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
          getRowId={(row) => row.idRow}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 15 },
            },
          }}
          pageSizeOptions={[5, 15, 25, 50]}
          disableRowSelectionOnClick
          disableColumnMenu
          autoHeight
          rowHeight={56}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'error.lighter',
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
