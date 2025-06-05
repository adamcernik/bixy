'use client';

import React from 'react';
import { Container, Typography, Paper, Box, Divider } from '@mui/material';

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 6, mt: 4, borderRadius: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" align="center">
          Můj příběh
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
          Jak z UX Designera vznikl elektrokolo expert
        </Typography>
        <Typography variant="body1" paragraph>
          Celý můj příběh s elektrokoly začal úplnou náhodou. Jako UX Designer jsem měl kancelář v budově na Letné, kde bylo v přízemí jedno z prvních prodejnictví elektrokol v České republice. Každý den jsem míjel výlohu s elektrokoly a postupně mě začala zajímat technologie, která se za nimi skrývá.
        </Typography>

        <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
          První kroky
        </Typography>
        <Typography variant="body1" paragraph>
          Co začalo jako zvědavost, rychle přerostlo v něco většího, když jsem dostal nabídku pomoct s přípravou prvních Bulls elektrokol prodávaných v České republice pro oficiálního dovozce. Najednou jsem se ocitl u zrodu českého trhu s elektrokoly a fascinovala mě kombinace mechaniky a pokročilé elektroniky.
        </Typography>

        <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
          Učení za pochodu
        </Typography>
        <Typography variant="body1" paragraph>
          Bylo to období divokého západu - elektrokola byla nová technologie a všichni jsme se učili za pochodu. Pamatuji si, když byl každý druhý motor Brose vadný a já jsem musel vyjednávat nápravy přímo s výrobcem. Naštěstí je to už dávná minulost a dnešní motory jsou naprosto spolehlivé.
        </Typography>

        <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
          UX mindset v prodeji kol
        </Typography>
        <Typography variant="body1" paragraph>
          Moje práce UX Designera mě naučila jednu věc - zákaznická spokojenost je nejdůležitější. Když mi začali volat lidé s dotazy na kola, přistupoval jsem k tomu úplně jinak než klasické prodejny. Nezajímalo mě "prodat kolo", ale najít to pravé pro konkrétního člověka.
        </Typography>

        <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
          Z koníčka profesí
        </Typography>
        <Typography variant="body1" paragraph>
          Postupně jsem si vybudoval domácí dílnu s profesionální diagnostikou, navázal úzké vztahy s oficliálními dodavateli Bulls i výrobci motorů. Lidé mi začali důvěřovat a doporučovali mě dál. Co bylo kdysi koníčkem, se stalo byznysem založeným na dlouhodobých vztazích a spokojenosti zákazníků.
        </Typography>

        <Typography variant="body1" paragraph sx={{ mt: 4, fontWeight: 'bold' }}>
          Dělám to dlouho, dělám to rád a jsem v tom dobrý. A hlavně - kombinuji technickou expertizu s osobním přístupem, který v tomto oboru často chybí.
        </Typography>
      </Paper>
    </Container>
  );
} 