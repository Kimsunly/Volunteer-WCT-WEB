// Organizer dashboard layout
export default function OrganizerLayout({ children }) {
    return (
        <div className="organizer-dashboard">
            {/* Sidebar navigation will be added here */}
            <main className="organizer-main-content">
                {children}
            </main>
        </div>
    );
}
