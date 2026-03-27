import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';

interface User {
  [key: string]: string;
}

const SignUp = () => {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    verificationCode: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      showNotification("Passwords don't match!", 'error');
      return;
    }
    console.log(user);
  };

  const handleSendCode = () => {
    if (!user.email) {
      showNotification('Please enter your email first to receive the code.', 'error');
      return;
    }
    setCodeSent(true);
    setCountdown(60);
    showNotification(`A verification code has been sent to ${user.email}`, 'success');
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
        <Typography variant="h3">Sign Up</Typography>
        <Typography mt={1.5} variant="body2" color="text.disabled">
          Join us and start your journey today!
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          size="large"
          fullWidth
          startIcon={<IconifyIcon icon="logos:google-icon" />}
          sx={{
            mt: 4,
            fontWeight: 600,
            bgcolor: 'info.main',
            '& .MuiButton-startIcon': { mr: 1.5 },
            '&:hover': { bgcolor: 'info.main' },
          }}
        >
          Sign up with Google
        </Button>

        <Divider sx={{ my: 3 }}>or</Divider>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            id="name"
            name="name"
            type="text"
            label="Name"
            value={user.name}
            onChange={handleInputChange}
            variant="filled"
            placeholder="Your Name"
            autoComplete="name"
            sx={{ mt: 3 }}
            fullWidth
            autoFocus
            required
          />
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
            sx={{ mt: 6 }}
            fullWidth
            required
          />
          <TextField
            id="verificationCode"
            name="verificationCode"
            type="text"
            label="Verification Code"
            value={user.verificationCode}
            onChange={handleInputChange}
            variant="filled"
            placeholder="Enter 6-digit code"
            sx={{ mt: 6 }}
            fullWidth
            required
            helperText={codeSent ? 'Verification code sent to your email.' : ''}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="text"
                    color="primary"
                    onClick={handleSendCode}
                    disabled={countdown > 0 || !user.email}
                    sx={{ fontWeight: 600, mr: -1 }}
                  >
                    {countdown > 0
                      ? `Resend in ${countdown}s`
                      : codeSent
                        ? 'Resend Code'
                        : 'Send Code'}
                  </Button>
                </InputAdornment>
              ),
            }}
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

          <TextField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={user.confirmPassword}
            onChange={handleInputChange}
            variant="filled"
            placeholder="Resubmit password"
            autoComplete="new-password"
            sx={{ mt: 6 }}
            fullWidth
            required
            error={Boolean(user.confirmPassword) && user.password !== user.confirmPassword}
            helperText={
              Boolean(user.confirmPassword) && user.password !== user.confirmPassword
                ? "Passwords don't match"
                : ''
            }
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    opacity: user.confirmPassword ? 1 : 0,
                    pointerEvents: user.confirmPassword ? 'auto' : 'none',
                  }}
                >
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    sx={{ border: 'none', bgcolor: 'transparent !important' }}
                    edge="end"
                  >
                    <IconifyIcon
                      icon={
                        showConfirmPassword ? 'ic:outline-visibility' : 'ic:outline-visibility-off'
                      }
                      color="neutral.main"
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" variant="contained" size="large" sx={{ mt: 3 }} fullWidth>
            Sign Up
          </Button>
        </Box>

        <Typography
          mt={3}
          variant="body2"
          textAlign={{ xs: 'center', md: 'left' }}
          letterSpacing={0.25}
        >
          Already have an account?{' '}
          <Link href={paths.signin} color="primary.main" fontWeight={600}>
            Let's Sign in
          </Link>
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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%', color: 'white' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default SignUp;
