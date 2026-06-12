import { api } from "@/services/api";
import { listUsers } from "./users";
import { listOrganizers } from "./organizers";
import { listOpportunities } from "./opportunities";
import { listDonations } from "./donations";

const PAGE_SIZE = 100;
const MAX_PAGES = 10;

const asArray = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.items)) return response.items;
    return [];
};

const getTotal = (response, items) => {
    return response?.total ?? response?.meta?.total ?? items.length ?? 0;
};

const toNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeStatus = (value) => String(value || "").toLowerCase();

const fetchAllPages = async (fetcher, baseParams = {}, maxPages = MAX_PAGES) => {
    let offset = 0;
    let collected = [];
    let total = Infinity;

    for (let page = 0; page < maxPages && collected.length < total; page += 1) {
        const response = await fetcher({ ...baseParams, limit: PAGE_SIZE, offset });
        const items = asArray(response);
        collected = collected.concat(items);
        total = getTotal(response, collected);

        if (items.length < PAGE_SIZE) break;
        offset += PAGE_SIZE;
    }

    return collected;
};

const getMonthKey = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const buildLastMonths = (count = 6) => {
    const now = new Date();
    const months = [];
    for (let i = count - 1; i >= 0; i -= 1) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
            label: date.toLocaleDateString(undefined, { month: "short", year: "numeric" }),
        });
    }
    return months;
};

const countByStatus = (items, acceptedStatuses, statusKey = "status") =>
    items.filter((item) => acceptedStatuses.includes(normalizeStatus(item?.[statusKey]))).length;

const countByRole = (items) => {
    const roles = ["user", "organizer", "admin"];
    return roles.map((role) => ({
        label: role.charAt(0).toUpperCase() + role.slice(1),
        value: items.filter((item) => normalizeStatus(item?.role) === role).length,
    }));
};

const sumDonationSeries = (donations, months) => {
    const buckets = Object.fromEntries(months.map((month) => [month.key, 0]));
    donations.forEach((donation) => {
        const monthKey = getMonthKey(donation?.created_at || donation?.createdAt);
        if (!monthKey || !(monthKey in buckets)) return;
        buckets[monthKey] += toNumber(donation?.amount ?? donation?.donation_amount ?? donation?.value);
    });

    return months.map((month) => buckets[month.key]);
};

export async function getDashboardOverview() {
    const [users, organizers, opportunities, donations] = await Promise.all([
        fetchAllPages(listUsers),
        fetchAllPages(listOrganizers),
        fetchAllPages(listOpportunities),
        fetchAllPages(listDonations),
    ]);

    const donationsTotal = donations.reduce(
        (sum, donation) => sum + toNumber(donation?.amount ?? donation?.donation_amount ?? donation?.value),
        0,
    );

    const activeOpportunityStatuses = ["active", "approved", "published", "open"];
    const pendingOpportunityStatuses = ["pending", "draft"];
    const rejectedOpportunityStatuses = ["rejected", "closed", "inactive"];

    const verifiedOrganizerStatuses = ["verified", "approved", "active"];
    const pendingOrganizerStatuses = ["pending", "reviewing"];
    const rejectedOrganizerStatuses = ["rejected", "suspended", "inactive"];

    const months = buildLastMonths(6);

    return {
        metrics: {
            donations_total: donationsTotal,
            users_count: users.length,
            opportunities_count: {
                active: countByStatus(opportunities, activeOpportunityStatuses),
                pending: countByStatus(opportunities, pendingOpportunityStatuses),
                rejected: countByStatus(opportunities, rejectedOpportunityStatuses),
            },
            organizers_count: {
                verified: countByStatus(organizers, verifiedOrganizerStatuses),
                pending: countByStatus(organizers, pendingOrganizerStatuses),
                rejected: countByStatus(organizers, rejectedOrganizerStatuses),
            },
        },
        chartData: {
            monthlyDonations: {
                labels: months.map((month) => month.label),
                values: sumDonationSeries(donations, months),
            },
            usersByRole: countByRole(users),
            organizersByStatus: [
                {
                    label: "Verified",
                    value: countByStatus(organizers, verifiedOrganizerStatuses),
                },
                {
                    label: "Pending",
                    value: countByStatus(organizers, pendingOrganizerStatuses),
                },
                {
                    label: "Rejected",
                    value: countByStatus(organizers, rejectedOrganizerStatuses),
                },
            ],
            opportunitiesByStatus: [
                {
                    label: "Active",
                    value: countByStatus(opportunities, activeOpportunityStatuses),
                },
                {
                    label: "Pending",
                    value: countByStatus(opportunities, pendingOpportunityStatuses),
                },
                {
                    label: "Rejected",
                    value: countByStatus(opportunities, rejectedOpportunityStatuses),
                },
            ],
        },
        collections: {
            users,
            organizers,
            opportunities,
            donations,
        },
    };
}

export async function getDashboardMetrics() {
    try {
        const { data } = await api.get("/api/admin/metrics");
        return data;
    } catch (err) {
        const overview = await getDashboardOverview();
        return overview.metrics;
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
