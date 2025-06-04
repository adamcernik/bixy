'use client';

import { Box, Typography, Paper, Container } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';

export default function ContactPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center" fontWeight="bold">
        Kontakt
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-12px' }}>
          <div style={{ flex: '1 1 100%', padding: '12px', minWidth: '300px' }}>
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6">Adam Černík</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PhoneIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
                <Typography>
                  <a 
                    href="tel:+420604650511" 
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'none',
                      borderBottom: '1px dotted #999'
                    }}
                  >
                    +420 604 650 511
                  </a>
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <EmailIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
                <Typography>
                  <a 
                    href="mailto:adam.cernik@gmail.com" 
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'none',
                      borderBottom: '1px dotted #999'
                    }}
                  >
                    adam.cernik@gmail.com
                  </a>
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
                <Typography>Praha, Česká republika</Typography>
              </Box>
            </Box>
          </div>
          
          <div style={{ flex: '1 1 100%', padding: '12px', minWidth: '300px' }}>
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <div style={{ width: '100%', height: '300px', position: 'relative' }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d163930.6065173722!2d14.31607776665173!3d50.05966728298811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b939c0970798b%3A0x400af0f66164090!2sPrague%2C%20Czechia!5e0!3m2!1sen!2sus!4v1701280272955!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, borderRadius: '8px' }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </Box>
          </div>
        </div>
      </Paper>
      
      <Typography 
        variant="body2" 
        align="center" 
        sx={{ mt: 4, color: 'text.secondary' }}
      >
        Neváhejte mě kontaktovat s jakýmikoli dotazy ohledně kol nebo možné spolupráce.
      </Typography>
    </Container>
  );
} 