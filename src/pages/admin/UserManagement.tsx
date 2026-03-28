import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import IconifyIcon from 'components/base/IconifyIcon';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { usersData as initialUsersData } from 'data/adminMockData';

// ─── Plan chip colors ────────────────────────────────────────
const planChipColors: Record<string, { bg: string; text: string }> = {
  Basic: { bg: '#E3F2FD', text: '#1565C0' },
  Premium: { bg: '#FFF3E0', text: '#E65100' },
  Enterprise: { bg: '#EDE7F6', text: '#4527A0' },
};

// ─── Status chip colors ──────────────────────────────────────
const statusChipColors: Record<string, 'success' | 'error' | 'default'> = {
  Active: 'success',
  Suspended: 'error',
  Inactive: 'default',
};

const planOptions = ['Basic', 'Premium', 'Enterprise'];

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsersData);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<(typeof initialUsersData)[0] | null>(null);
  const [selectedPlan, setSelectedPlan] = useState('');

  const handleOpenDialog = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setSelectedPlan(user.plan);
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setSelectedPlan('');
  };

  const handleConfirm = () => {
    if (!selectedUser || !selectedPlan) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? { ...u, plan: selectedPlan } : u)),
    );
    handleCloseDialog();
  };

  // Filter users by search
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.plan.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q),
    );
  }, [users, searchQuery]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 60, sortable: false },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'joined',
      headerName: 'Joined',
      width: 120,
    },
    {
      field: 'videosUploaded',
      headerName: 'Videos',
      type: 'number',
      width: 90,
      align: 'center',
      headerAlign: 'center',
    },
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
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const color = statusChipColors[params.value as string] || 'default';
        return (
          <Chip label={params.value as string} color={color} size="small" sx={{ minWidth: 85 }} />
        );
      },
    },
    {
      field: 'actions',
      headerName: '',
      width: 130,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<IconifyIcon icon="ic:round-card-giftcard" />}
          onClick={() => handleOpenDialog(params.row.id as number)}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            fontSize: '0.8rem',
            px: 2,
          }}
        >
          Give Plan
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" mb={1}>
        User Management
      </Typography>
      <Typography variant="body2" color="text.disabled" mb={3}>
        View, manage creators, and assign subscription plans.
      </Typography>

      {/* Search Bar */}
      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by name, email, plan, or status..."
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
          rows={filteredUsers}
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

      {/* ─── Give Plan Modal ──────────────────────────────── */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 4 },
        }}
      >
        <Box sx={{ px: 3, pt: 3, pb: 1 }}>
          <Typography variant="h5" fontWeight={700}>
            Give Plan
          </Typography>
        </Box>

        <Box sx={{ px: 3, pt: 2, pb: 3 }}>
          {selectedUser && (
            <>
              {/* User info table */}
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
                <Stack direction="row">
                  <Box sx={{ flex: 1, px: 2, py: 1.5, borderRight: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.disabled" display="block">
                      Nama
                    </Typography>
                    <Typography variant="body2" fontWeight={600} mt={0.5}>
                      {selectedUser.name}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, px: 2, py: 1.5, borderRight: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.disabled" display="block">
                      Email
                    </Typography>
                    <Typography variant="body2" fontWeight={600} mt={0.5}>
                      {selectedUser.email}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, px: 2, py: 1.5 }}>
                    <Typography variant="caption" color="text.disabled" display="block">
                      Current Plan
                    </Typography>
                    <Chip
                      label={selectedUser.plan}
                      size="small"
                      sx={{
                        mt: 0.5,
                        fontWeight: 600,
                        bgcolor: planChipColors[selectedUser.plan]?.bg,
                        color: planChipColors[selectedUser.plan]?.text,
                      }}
                    />
                  </Box>
                </Stack>
              </Paper>

              {/* Plan dropdown */}
              <FormControl fullWidth>
                <InputLabel>Select Plan</InputLabel>
                <Select
                  value={selectedPlan}
                  label="Select Plan"
                  onChange={(e: SelectChangeEvent<string>) => setSelectedPlan(e.target.value)}
                >
                  {planOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!selectedPlan || selectedPlan === selectedUser?.plan}
            onClick={handleConfirm}
            sx={{ textTransform: 'none', fontWeight: 600, px: 4, borderRadius: 2 }}
          >
            Confirm
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
