'use client';

import { Container, Typography, Paper, Box } from '@mui/material';

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 6, mt: 4, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Coming Soon
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          We're working on something exciting!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Our About page is currently under construction. Check back soon to learn more about Adam Bikes and our story.
        </Typography>
      </Paper>
    </Container>
  );
} 