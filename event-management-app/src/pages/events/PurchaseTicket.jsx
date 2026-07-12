import { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    Chip,
    CircularProgress,
    Alert,
    Divider,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../../services/eventService';
import { getTicketTypesByEvent } from '../../services/ticketTypeService';
import { initializePayment } from '../../services/paymentService';

const PurchaseTicket = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventData, ticketTypesData] = await Promise.all([
                    getEventById(eventId),
                    getTicketTypesByEvent(eventId),
                ]);
                setEvent(eventData);
                setTicketTypes(ticketTypesData);
            } catch {
                setError('Failed to load event details');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [eventId]);

    const handlePurchase = async (ticketTypeId) => {
        setPurchasing(ticketTypeId);
        setError('');
        try {
            const response = await initializePayment({ ticketTypeId });
            window.open(response.authorizeUrl, '_blank');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initialize payment');
            setPurchasing(null);
        }
    };

    const getChipColor = (name) => {
        switch (name) {
            case 'VIP': return 'error';
            case 'EARLY_BIRD': return 'success';
            case 'RESERVED': return 'warning';
            default: return 'primary';
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
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button onClick={() => navigate('/events')} sx={{ mb: 2 }}>
                ← Back to Events
            </Button>

            {event && (
                <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h4">{event.name}</Typography>
                        <Chip label={event.status} color="primary" />
                    </Box>
                    <Typography color="text.secondary" mb={1}>{event.eventDesc}</Typography>
                    <Typography variant="body2">📍 {event.venue}</Typography>
                </Paper>
            )}

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Typography variant="h5" mb={2}>Select Ticket Type</Typography>

            {ticketTypes.length === 0 ? (
                <Typography color="text.secondary">
                    No ticket types available for this event yet.
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {ticketTypes.map((tt) => (
                        <Card key={tt.id} elevation={2}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="h6">{tt.name}</Typography>
                                        <Chip
                                            label={tt.name}
                                            color={getChipColor(tt.name)}
                                            size="small"
                                        />
                                    </Box>
                                    <Typography variant="h5" color="primary">
                                        ₦{tt.price.toLocaleString()}
                                    </Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', gap: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Available: <strong>{tt.availableQuantity}</strong>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total: <strong>{tt.totalQuantity}</strong>
                                    </Typography>
                                    {tt.salesEnd && (
                                        <Typography variant="body2" color="text.secondary">
                                            Sales end: <strong>{new Date(tt.salesEnd).toLocaleDateString()}</strong>
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>
                            <CardActions sx={{ px: 2, pb: 2 }}>
                                <Button
                                    variant="contained"
                                    disabled={tt.availableQuantity === 0 || purchasing === tt.id}
                                    onClick={() => handlePurchase(tt.id)}
                                >
                                    {purchasing === tt.id
                                        ? 'Processing...'
                                        : tt.availableQuantity === 0
                                        ? 'Sold Out'
                                        : 'Purchase Ticket'}
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default PurchaseTicket;