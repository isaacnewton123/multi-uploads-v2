import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';

interface UploadStatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor?: string;
}

const UploadStatsCard = ({
  title,
  value,
  icon,
  iconColor = 'primary.main',
}: UploadStatsCardProps) => {
  return (
    <Stack component={Paper} p={2.5} alignItems="center" spacing={2.25} height={100}>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        height={56}
        width={56}
        bgcolor="info.main"
        borderRadius="50%"
      >
        <IconifyIcon icon={icon} fontSize="h2.fontSize" color={iconColor} />
      </Stack>
      <div>
        <Typography variant="body2" color="text.disabled">
          {title}
        </Typography>
        <Typography mt={0.25} variant="h3">
          {value}
        </Typography>
      </div>
    </Stack>
  );
};

export default UploadStatsCard;
