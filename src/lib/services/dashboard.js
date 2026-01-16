import { api } from "@/services/api";
import { listUsers } from "./users";
import { listOrganizers } from "./organizers";
import { listOpportunities } from "./opportunities";
import { listDonations } from "./donations";

export async function getDashboardMetrics() {
    // Try dedicated metrics endpoint first
    try {
        const { data } = await api.get("/api/admin/metrics");
        return data;
    } catch (err) {
        // Fallback: aggregate metrics from available endpoints
        try {
            const [usersRes, orgsPendingRes, oppsActiveRes, donationsRes] = await Promise.all([
                listUsers({ limit: 1, offset: 0 }),
                listOrganizers({ status: "pending", limit: 1, offset: 0 }),
                listOpportunities({ status: "active", limit: 1, offset: 0 }),
                listDonations({ limit: 100, offset: 0 }),
            ]);

            const usersTotal = usersRes?.total ?? usersRes?.data?.length ?? usersRes?.items?.length ?? 0;
            const organizersPendingTotal = orgsPendingRes?.total ?? orgsPendingRes?.data?.length ?? orgsPendingRes?.items?.length ?? 0;
            const opportunitiesActiveTotal = oppsActiveRes?.total ?? oppsActiveRes?.data?.length ?? oppsActiveRes?.items?.length ?? 0;
            const donationsItems = donationsRes?.data ?? donationsRes?.items ?? [];
            const donationsTotalAmount = Array.isArray(donationsItems)
                ? donationsItems.reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
                : 0;

            return {
                users_count: usersTotal,
                organizers_count: { pending: organizersPendingTotal },
                opportunities_count: { active: opportunitiesActiveTotal },
                donations_total: donationsTotalAmount,
            };
        } catch (aggErr) {
            throw aggErr;
        }
    }
}

export async function getAdminStats() {
    const { data } = await api.get("/api/admin/stats");
    return data;
}

export async function getAdminLogs({ limit = 50, offset = 0 } = {}) {
    const params = { limit, offset };
    const { data } = await api.get("/api/admin/logs", { params });
    return data;
}
