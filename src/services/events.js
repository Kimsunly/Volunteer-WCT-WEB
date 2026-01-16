
import { api } from './api';

export async function listUpcomingEvents() {
    const { data } = await api.get('/events/upcoming');
    // Expect: [{ id, dateDay, dateMonth, imageUrl, category: {label, icon, colorClass}, title, description, location, timeRange }]
    return data;
}

