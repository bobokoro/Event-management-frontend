import { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Alert,
    IconButton,
    Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketTypesByEvent, createTicketType, deleteTicketType } from '../../services/ticketTypeService';

const ticketTypeOptions = ['VIP', 'REGULAR', 'EARLY_BIRD', 'RESERVED'];

const TicketTypes = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [ticketTypes, setTicketTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: 'VIP',
        price: '',
        totalQuantity: '',
        salesStart: '',
        salesEnd: '',
    });

    useEffect(() => {
        const fetchTicketTypes = async () => {
            try {
                const data = await getTicketTypesByEvent(eventId);
                setTicketTypes(data);
            } catch {
                setError('Failed to load ticket types');
            } finally {
                setLoading(false);
            }
        };
        fetchTicketTypes();
    }, [eventId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = async () => {
        setError('');
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                totalQuantity: parseInt(formData.totalQuantity),
            };
            const created = await createTicketType(eventId, payload);
            setTicketTypes([...ticketTypes, created]);
            setOpenDialog(false);
            setFormData({
                name: 'VIP',
                price: '',
                totalQuantity: '',
                salesStart: '',
                salesEnd: '',
            });
        } catch {
            setError('Failed to create ticket type');
        }
    };

    const handleDelete = async (ticketTypeId) => {
        if (window.confirm('Delete this ticket type?')) {
            try {
                await deleteTicketType(eventId, ticketTypeId);
                setTicketTypes(ticketTypes.filter(tt => tt.id !== ticketTypeId));
            } catch {
                setError('Failed to delete ticket type');
            }
        }
    };

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Button onClick={() => navigate(`/events/${eventId}`)} sx={{ mb: 2 }}>
                ← Back to Event
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Ticket Types</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    Add Ticket Type
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Available</TableCell>
                            <TableCell>Sales Start</TableCell>
                            <TableCell>Sales End</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ticketTypes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No ticket types yet
                                </TableCell>
                            </TableRow>
                        ) : (
                            ticketTypes.map((tt) => (
                                <TableRow key={tt.id}>
                                    <TableCell>
                                        <Chip label={tt.name} color="primary" size="small" />
                                    </TableCell>
                                    <TableCell>₦{tt.price.toLocaleString()}</TableCell>
                                    <TableCell>{tt.totalQuantity}</TableCell>
                                    <TableCell>{tt.availableQuantity}</TableCell>
                                    <TableCell>
                                        {tt.salesStart ? new Date(tt.salesStart).toLocaleDateString() : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {tt.salesEnd ? new Date(tt.salesEnd).toLocaleDateString() : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(tt.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create Ticket Type Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Ticket Type</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        fullWidth
                        select
                        label="Type"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                    >
                        {ticketTypeOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        label="Price (₦)"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Total Quantity"
                        name="totalQuantity"
                        type="number"
                        value={formData.totalQuantity}
                        onChange={handleChange}
                        margin="normal"
                        required
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate}>Create</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TicketTypes;