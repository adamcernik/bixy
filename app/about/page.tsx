'use client';

import { Container, Typography, Paper, Box } from '@mui/material';
import Image from 'next/image';
import { getAssetPath } from '../utils/pathUtils';

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center" fontWeight="bold">
        About Me
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box 
            sx={{ 
              width: { xs: '100%', md: '40%' }, 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}
          >
            <Box 
              sx={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: '300px', 
                height: '300px',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              <img
                src={getAssetPath('/bixy-logo.svg')}
                alt="Bixy Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: '60%' } }}>
            <Typography variant="h5" gutterBottom>
              Passion for Cycling
            </Typography>
            <Typography paragraph>
              As a dedicated bike enthusiast, I've spent years exploring the world on two wheels and sharing my passion with others. 
              I believe that every person deserves to find the perfect bike that matches their needs, style, and aspirations.
            </Typography>
            <Typography paragraph>
              My journey began with a simple love for cycling, which evolved into a deep appreciation for the engineering, design, and 
              transformative power of bikes. Whether it's helping a beginner find their first comfortable ride, assisting an experienced 
              cyclist in upgrading to a performance machine, or guiding families toward the right bikes for memorable adventures together, 
              nothing makes me happier than connecting people with their ideal bicycles.
            </Typography>
            <Typography paragraph>
              I founded Bixy with a simple mission: to make the process of finding, comparing, and choosing bikes more transparent, 
              enjoyable, and rewarding. When I see the smile on someone's face as they ride away on a bike that perfectly suits them, 
              I know I've made a positive difference.
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <Typography 
        variant="body2" 
        align="center" 
        sx={{ mt: 4, color: 'text.secondary' }}
      >
        Let's discover your perfect ride together!
      </Typography>
    </Container>
  );
} 