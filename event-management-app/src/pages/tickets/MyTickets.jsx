import { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Alert,
    Divider,
    Grid,
} from '@mui/material';
import { getMyTickets } from '../../services/ticketService';

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const data = await getMyTickets();
                setTickets(data);
            } catch {
                setError('Failed to load tickets');
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'USED': return 'default';
            case 'CANCELLED': return 'error';
            case 'EXPIRED': return 'warning';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" mb={3}>My Tickets</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {tickets.length === 0 ? (
                <Typography color="text.secondary">
                    You have no tickets yet. Browse events to purchase tickets!
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {tickets.map((ticket) => (
                        <Grid item xs={12} md={6} key={ticket.id}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="h6">{ticket.eventName}</Typography>
                                        <Chip
                                            label={ticket.status}
                                            color={getStatusColor(ticket.status)}
                                            size="small"
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" mb={2}>
                                        {ticket.ticketTypeName} Ticket
                                    </Typography>

                                    <Divider sx={{ mb: 2 }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Ticket Code
                                            </Typography>
                                            <Typography variant="h6" fontFamily="monospace">
                                                {ticket.ticketCode}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" mt={1}>
                                                Attendee
                                            </Typography>
                                            <Typography variant="body2">
                                                {ticket.attendeeName}
                                            </Typography>
                                            {ticket.validatedAt && (
                                                <>
                                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                                        Validated At
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {new Date(ticket.validatedAt).toLocaleString()}
                                                    </Typography>
                                                </>
                                            )}
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                                QR Code
                                            </Typography>
                                            <img
                                                src={ticket.qrCode}
                                                alt="QR Code"
                                                style={{ width: 120, height: 120 }}
                                            />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default MyTickets;