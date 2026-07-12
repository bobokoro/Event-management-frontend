import { useEffect, useState } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    Chip,
    Button,
    CircularProgress,
    Divider,
    Stack,

} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, deleteEvent} from '../../services/eventService';

const EventDetail = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
  const fetchEvent = async ()=> {
    try {
      const data = await getEventById(id);
      setEvent(data);
    }catch (err) {
      console.error('failed to load event', err);
    } finally {
      setLoading(false);
    }
  };
  fetchEvent();
  }, [id]);

  const handleDelete = async ()=> {
    if (window.confirm('Are you sure you want to delete this event?')){
      try {
        await deleteEvent(id);
        navigate('/events');
      }catch (err) {
        console.error('Failed to delete event', err);
      }
    }
  };

if (loading){
  return (
    <Box sx ={{display: 'flex', justifyContent: 'center', mt: 8}}>
      <CircularProgress />
    </Box>
  );
}

if (!event) {
  return (
    <Container sx ={{ mt: 4}}>
      <Typography>Event not found.</Typography>
    </Container>
  );
}

return (
  <Container maxWidth ="md" sx ={{ mt: 4, mb: 4}}>
    <Button onClick={() => navigate('/events')} sx={{ mb:2}}> 
      ← Back to Events
            </Button>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h4">{event.name}</Typography>
                    <Chip label={event.status} color="primary" />
                </Box>

                <Typography variant="body1" color="text.secondary" mb={3}>
                    {event.eventDesc}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Venue
                        </Typography>
                        <Typography variant="body1">{event.venue}</Typography>
                    </Box>

                    {event.start && (
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                Start
                            </Typography>
                            <Typography variant="body1">
                                {new Date(event.start).toLocaleString()}
                            </Typography>
                        </Box>
                    )}

                    {event.end && (
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                End
                            </Typography>
                            <Typography variant="body1">
                                {new Date(event.end).toLocaleString()}
                            </Typography>
                        </Box>
                    )}
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        onClick={() => navigate(`/events/${id}/edit`)}
                    >
                        Edit Event
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(`/events/${id}/ticket-types`)}
                    >
                        Manage Ticket Types
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDelete}
                    >
                        Delete Event
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
};

export default EventDetail;