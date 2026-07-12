import { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    TextField,
    Alert,
    Divider,
    Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { validateByCode } from '../../services/validationService';

const ValidateTicket = () => {
    const [ticketCode, setTicketCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleValidate = async () => {
        if (!ticketCode.trim()) {
            setError('Please enter a ticket code');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const response = await validateByCode({
                ticketCode: ticketCode.trim(),
                validationMethod: 'TICKET_CODE'
            });
            setResult(response);
        } catch {
            setError('Failed to validate ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setTicketCode('');
        setResult(null);
        setError('');
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" mb={3}>Ticket Validation</Typography>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h6" mb={2}>Enter Ticket Code</Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <TextField
                    fullWidth
                    label="Ticket Code"
                    placeholder="e.g. TKT-A7DB59FB"
                    value={ticketCode}
                    onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
                    margin="normal"
                    onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
                />

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleValidate}
                        disabled={loading}
                    >
                        {loading ? 'Validating...' : 'Validate Ticket'}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleClear}
                    >
                        Clear
                    </Button>
                </Box>
            </Paper>

            {result && (
                <Paper
                    elevation={3}
                    sx={{
                        p: 4, mt: 3,
                        borderLeft: 6,
                        borderColor: result.valid ? 'success.main' : 'error.main'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        {result.valid
                            ? <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                            : <CancelIcon color="error" sx={{ fontSize: 40 }} />
                        }
                        <Typography
                            variant="h5"
                            color={result.valid ? 'success.main' : 'error.main'}
                        >
                            {result.message}
                        </Typography>
                    </Box>

                    {result.ticketCode && (
                        <>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Event</Typography>
                                    <Typography variant="body2">{result.eventName}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Ticket Type</Typography>
                                    <Typography variant="body2">{result.ticketTypename}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Attendee</Typography>
                                    <Typography variant="body2">{result.attendeeName}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Ticket Code</Typography>
                                    <Typography variant="body2" fontFamily="monospace">{result.ticketCode}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Status</Typography>
                                    <Chip
                                        label={result.status}
                                        color={result.valid ? 'success' : 'error'}
                                        size="small"
                                    />
                                </Box>
                                {result.validatedAt && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">Validated At</Typography>
                                        <Typography variant="body2">
                                            {new Date(result.validatedAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </>
                    )}
                </Paper>
            )}
        </Container>
    );
};

export default ValidateTicket;