import React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function FAQ() {
    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    return (
        <div className='p-2'>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>De ce am inceput cu 0% procentaj de castig?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Ne dorim sa avem statistici reale asa ca in ziua lansarii aplicatiei,
                        numarul biletelor generate era de 0, meciurile acestor bilete, urmand
                        sa fie actualizate cu statisticile fiecarui meci al biletelor generate.
                        Prin generarea de bilete ne ajutati la modificarea acestor statistici.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                    <Typography>Cum functioneaza aplicatia?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lucas Andrei analizeaza meciurile de fotbal din fiecare zi, si le adauga intr-o
                        baza de date, de unde sunt mai apoi oferite pentru generarea biletelor
                        in aceasta aplicatie.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                    <Typography>Cate meciuri se pot genera maxim pe bilet?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Poti genera intre unu(1) si douazeci(20) de meciuri pe bilet.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                    <Typography>De ce nu se genereaza corect biletul de Superbet?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Desi ne straduim sa actualizam cat mai prompt toate informatiile,
                        unele meciuri sau pariuri pot sa nu mai fie disponibile in momentul generarii biletului.
                        De aceea nu tot timpul numarul de meciuri pe bilet poate fi diferit de cel al codului pentru
                        Superbet.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}