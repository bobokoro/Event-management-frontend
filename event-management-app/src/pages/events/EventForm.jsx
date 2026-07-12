import { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    MenuItem,
    Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent, getEventById, updateEvent } from '../../services/eventService';

const statuses = ['DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED'];

const EventForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        eventDesc: '',
        venue: '',
        status: 'DRAFT',
        start: '',
        end: '',
        salesStart: '',
        salesEnd: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isEditMode) return;

    const fetchEvent = async () => {
        try {
            const data = await getEventById(id);
            setFormData({
                name: data.name || '',
                eventDesc: data.eventDesc || '',
                venue: data.venue || '',
                status: data.status || 'DRAFT',
                start: data.start ? data.start.slice(0, 16) : '',
                end: data.end ? data.end.slice(0, 16) : '',
                salesStart: data.salesStart ? data.salesStart.slice(0, 16) : '',
                salesEnd: data.salesEnd ? data.salesEnd.slice(0, 16) : '',
            });
        } catch  {
            setError('Failed to load event');
        }
    };

    fetchEvent();
    }, [id, isEditMode]);

    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditMode) {
                await updateEvent(id, formData);
                navigate(`/events/${id}`);
            } else {
                const organizerId = localStorage.getItem('userId');
                const payload = { ...formData, organizerId };
                const created = await createEvent(payload);
                navigate(`/events/${created.id}`);
            }
        } catch {
            setError('Failed to save event. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {isEditMode ? 'Edit Event' : 'Create Event'}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Event Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="eventDesc"
                        value={formData.eventDesc}
                        onChange={handleChange}
                        margin="normal"
                        multiline
                        rows={3}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Venue"
                        name="venue"
                        value={formData.venue}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        select
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        margin="normal"
                    >
                        {statuses.map((status) => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        label="Start Date"
                        name="start"
                        type="datetime-local"
                        value={formData.start}
                        onChange={handleChange}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="End Date"
                        name="end"
                        type="datetime-local"
                        value={formData.end}
                        onChange={handleChange}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="Sales Start"
                        name="salesStart"
                        type="datetime-local"
                        value={formData.salesStart}
                        onChange={handleChange}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="Sales End"
                        name="salesEnd"
                        type="datetime-local"
                        value={formData.salesEnd}
                        onChange={handleChange}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event'}
                        </Button>
                        <Button onClick={() => navigate('/events')}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default EventForm;