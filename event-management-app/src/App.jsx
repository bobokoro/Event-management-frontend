import '@fontsource/roboto'
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Navbar from './components/Navbar/Navbar'
import EventForm from './pages/events/EventForm';
import EventDetail from './pages/events/EventDetail';
import EventsList from './pages/events/EventsList';
import TicketTypes from './pages/events/TicketTypes';
import PurchaseTicket from './pages/events/PurchaseTicket';
import MyTickets from './pages/tickets/MyTickets';
import ValidateTicket from './pages/validation/ValidateTicket';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
};

const App = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/events"
                    element={
                        <ProtectedRoute>
                            <EventsList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/events/create"
                    element={
                        <ProtectedRoute>
                            <EventForm />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/events/:eventId/tickets"
                    element={
                        <ProtectedRoute>
                            <PurchaseTicket />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-tickets"
                    element={
                        <ProtectedRoute>
                            <MyTickets />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/validate"
                    element={
                        <ProtectedRoute>
                            <ValidateTicket />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/events/:eventId/ticket-types"
                    element={
                        <ProtectedRoute>
                            <TicketTypes />
                        </ProtectedRoute>
                    }
                />

                <Route 
                    path="/events/:id/edit"
                    element={
                        <ProtectedRoute>
                            <EventForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/events/:id"
                    element={
                        <ProtectedRoute>
                            <EventDetail />
                        </ProtectedRoute>
                    }
                />
                
                
            </Routes>
        </>
    );
};

export default App;
