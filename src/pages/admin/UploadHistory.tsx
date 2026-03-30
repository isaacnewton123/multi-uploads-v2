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

const statusColors: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
  published: 'success',
  failed: 'error',
  processing: 'warning',
  partial: 'info',
};

const platformIcons: Record<string, { icon: string; color: string }> = {
  youtube: { icon: 'logos:youtube-icon', color: '#FF0000' },
  facebook: { icon: 'logos:facebook', color: '#1877F2' },
  instagram: { icon: 'skill-icons:instagram', color: '#E4405F' },
  tiktok: { icon: 'ic:baseline-tiktok', color: '#000000' },
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 220, sortable: false },
  { field: 'title', headerName: 'Video Title', flex: 1.5, minWidth: 200 },
  { field: 'user', headerName: 'User ID', flex: 1, minWidth: 150 },
  {
    field: 'platforms',
    headerName: 'Platforms Target',
    width: 160,
    renderCell: (params: GridRenderCellParams) => (
      <Stack direction="row" spacing={0.5} alignItems="center" height="100%">
        {params.value.map((p: { platform: string; status: string }) => {
          const info = platformIcons[p.platform] || { icon: 'mdi:help', color: '#ccc' };
          return (
            <Box key={p.platform} position="relative" display="inline-flex">
              <IconifyIcon icon={info.icon} sx={{ fontSize: 18, color: info.color }} />
              {p.status === 'failed' && (
                <Box
                  position="absolute"
                  top={-4}
                  right={-4}
                  width={8}
                  height={8}
                  bgcolor="error.main"
                  borderRadius="50%"
                  border="1px solid white"
                />
              )}
            </Box>
          );
        })}
      </Stack>
    ),
  },
  { field: 'date', headerName: 'Date / Time', width: 170 },
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
        sx={{ minWidth: 90, fontWeight: 600, textTransform: 'capitalize' }}
      />
    ),
  },
];

interface UploadHistoryRow {
  id: string;
  title: string;
  user: string;
  platforms: { platform: string; status: string }[];
  date: string;
  status: string;
  searchString: string;
}

const UploadHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadsData, setUploadsData] = useState<UploadHistoryRow[]>([]);

  const fetchUploads = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:4000/api/videos?limit=1000');
      const data = await res.json();
      if (data.success) {
        const rows = data.data.map(
          (v: {
            _id: string;
            title: string;
            userId: string;
            platforms: { platform: string; status: string }[];
            createdAt: string;
            status: string;
          }) => ({
            id: v._id,
            title: v.title,
            user: v.userId || 'admin',
            platforms: v.platforms || [],
            date: new Date(v.createdAt).toLocaleString(),
            status: v.status,
            searchString: `${v.title} ${v.userId} ${v.status}`.toLowerCase(),
          }),
        );
        setUploadsData(rows);
      }
    } catch (e) {
      console.error('Failed to fetch global uploads', e);
    }
  }, []);

  useEffect(() => {
    fetchUploads();
    const interval = setInterval(fetchUploads, 5000);
    return () => clearInterval(interval);
  }, [fetchUploads]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return uploadsData;
    const q = searchQuery.toLowerCase();
    return uploadsData.filter((u) => u.searchString.includes(q));
  }, [searchQuery, uploadsData]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" mb={1}>
        Global Upload History
      </Typography>
      <Typography variant="body2" color="text.disabled" mb={3}>
        Real-time monitoring of all video uploads across your platform.
      </Typography>

      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by title, user ID, or status..."
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
          pageSizeOptions={[5, 10, 25, 50]}
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
