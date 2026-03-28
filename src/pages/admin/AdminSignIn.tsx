import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';

interface User {
  [key: string]: string;
}

const AdminSignIn = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Admin login attempt:', user);
    navigate(paths.adminDashboard);
  };

  return (
    <Stack
      mx="auto"
      width={1}
      maxWidth={410}
      minHeight="100%"
      direction="column"
      alignItems="center"
      py={{ xs: 4, md: 0 }}
    >
      <Box width={1} my="auto" py={{ xs: 3, md: 5 }}>
        <Typography variant="h3">Admin Login</Typography>
        <Typography mt={1.5} variant="body2" color="text.disabled">
          Enter your admin credentials to access the platform.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5 }}>
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            value={user.email}
            onChange={handleInputChange}
            variant="filled"
            placeholder="mail@example.com"
            autoComplete="email"
            sx={{ mt: 3 }}
            fullWidth
            autoFocus
            required
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={user.password}
            onChange={handleInputChange}
            variant="filled"
            placeholder="Min. 8 characters"
            autoComplete="current-password"
            sx={{ mt: 6 }}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    opacity: user.password ? 1 : 0,
                    pointerEvents: user.password ? 'auto' : 'none',
                  }}
                >
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ border: 'none', bgcolor: 'transparent !important' }}
                    edge="end"
                  >
                    <IconifyIcon
                      icon={showPassword ? 'ic:outline-visibility' : 'ic:outline-visibility-off'}
                      color="neutral.main"
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Stack mt={1.5} alignItems="center" justifyContent="space-between">
            <FormControlLabel
              control={<Checkbox id="checkbox" name="checkbox" size="medium" color="primary" />}
              label="Keep me logged in"
              sx={{ ml: -0.75 }}
            />
            <Link href="#!" fontSize="body2.fontSize" fontWeight={600}>
              Forgot password?
            </Link>
          </Stack>

          <Button type="submit" variant="contained" size="large" sx={{ mt: 3 }} fullWidth>
            Sign In
          </Button>
        </Box>

        <Typography
          mt={5}
          variant="body2"
          textAlign="center"
          color="error.main"
          letterSpacing={0.25}
        >
          Restricted to authorized personnel only.
        </Typography>
      </Box>

      <Typography
        variant="body2"
        color="text.disabled"
        fontWeight={500}
        mt={{ xs: 4, md: 'auto' }}
        pb={{ xs: 0, md: 4 }}
      >
        © 2024 MultiUploads. All rights reserved.
      </Typography>
    </Stack>
  );
};

export default AdminSignIn;
