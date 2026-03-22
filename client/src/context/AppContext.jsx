import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/react";
import { toast } from "react-hot-toast";
import { cities } from "../assets/assets.js";

// Setting the default base URL for Axios from environment variables
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

// Custom hook to use the AppContext easily in components
export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
    // Basic variables and Clerk hooks
    const currency = import.meta.env.VITE_CURRENCY || '$';
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth();

    // Global state variables
    const [isOwner, setIsOwner] = useState(false);
    const [showHotelRegistration, setShowHotelRegistration] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [searchedCities, setSearchedCities] = useState([]);

    // Function to fetch the authenticated user's role and search history
    const fetchUser = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/user/', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                // If the user role is 'hotel owner', set isOwner to true
                setIsOwner(data.role === 'hotel owner');
                setSearchedCities(data.recentSearchedCities);
            } else {
                // Retry logic if the request fails
                setTimeout(() => {
                    fetchUser();
                }, 5000);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Function to fetch all available rooms from the database
    const fetchRooms = async () => {
        try {
            const { data } = await axios.get('/api/rooms');
            if (data.success) {
                setRooms(data.rooms);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Effect to fetch user data whenever the Clerk user object changes
    useEffect(() => {
        if (user) {
            fetchUser();
        }
    }, [user]);

    // Effect to fetch all rooms once when the application loads
    useEffect(() => {
        fetchRooms();
    }, []);

    // The value object shared with all child components
    const value = {
        currency,
        navigate,
        user,
        getToken,
        isOwner,
        setIsOwner,
        axios,
        showHotelRegistration,
        setShowHotelRegistration,
        rooms,
        setRooms,
        searchedCities,
        setSearchedCities,
        cities // Provided for search forms
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};