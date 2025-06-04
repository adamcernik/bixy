'use client';

import { Container, Typography, Paper, Box } from '@mui/material';

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 6, mt: 4, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Již brzy
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Pracujeme na něčem zajímavém!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Naše stránka O nás je momentálně ve výstavbě. Brzy se zde dozvíte více o Adam Bikes a našem příběhu.
        </Typography>
      </Paper>
    </Container>
  );
} 