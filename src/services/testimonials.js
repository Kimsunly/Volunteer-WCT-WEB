
import { api } from './api';

export async function listTestimonials() {
    const { data } = await api.get('/testimonials');
    // Expect: [{ text, avatar, name, role }]
    return data;
}
