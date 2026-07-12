import { useState, useEffect, useRef } from 'react';
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
    Tabs,
    Tab,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { validateByCode, validateByQR } from '../../services/validationService';

const ValidateTicket = () => {
    const [ticketCode, setTicketCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [tab, setTab] = useState(0);
    const [scanning, setScanning] = useState(false);
    const scannerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear();
            }
        };
    }, []);

    const startScanner = () => {
        setScanning(true);
        setResult(null);
        setError('');

        setTimeout(() => {
            const scanner = new Html5QrcodeScanner('qr-reader', {
                fps: 10,
                qrbox: { width: 250, height: 250 },
            });

            scanner.render(
                async (decodedText) => {
                    scanner.clear();
                    setScanning(false);
                    await handleQRValidation(decodedText);
                },
                (errorMessage) => {
                    console.log('QR scan error:', errorMessage);
                }
            );

            scannerRef.current = scanner;
        }, 100);
    };

    const stopScanner = () => {
        if (scannerRef.current) {
            scannerRef.current.clear();
            scannerRef.current = null;
        }
        setScanning(false);
    };

    const handleQRValidation = async (qrContent) => {
        setLoading(true);
        setError('');
        try {
            const response = await validateByQR({
                qrCode: qrContent,
                validationMethod: 'QR_CODE'
            });
            setResult(response);
        } catch {
            setError('Failed to validate ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
        stopScanner();
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" mb={3}>Ticket Validation</Typography>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Tabs
                    value={tab}
                    onChange={(e, newValue) => {
                        setTab(newValue);
                        stopScanner();
                        setResult(null);
                        setError('');
                    }}
                    sx={{ mb: 3 }}
                >
                    <Tab label="Enter Code" />
                    <Tab label="Scan QR Code" icon={<QrCodeScannerIcon />} iconPosition="start" />
                </Tabs>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {tab === 0 && (
                    <>
                        <Typography variant="h6" mb={2}>Enter Ticket Code</Typography>
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
                            <Button variant="outlined" onClick={handleClear}>
                                Clear
                            </Button>
                        </Box>
                    </>
                )}

                {tab === 1 && (
                    <>
                        <Typography variant="h6" mb={2}>Scan QR Code</Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Point your camera at the attendee's QR code
                        </Typography>

                        {!scanning ? (
                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<QrCodeScannerIcon />}
                                onClick={startScanner}
                                disabled={loading}
                            >
                                {loading ? 'Validating...' : 'Start Camera'}
                            </Button>
                        ) : (
                            <>
                                <div id="qr-reader" style={{ width: '100%' }} />
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={stopScanner}
                                    sx={{ mt: 2 }}
                                >
                                    Stop Camera
                                </Button>
                            </>
                        )}
                    </>
                )}
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