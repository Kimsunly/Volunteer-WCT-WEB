// User dashboard layout
export default function UserLayout({ children }) {
    return (
        <div className="user-dashboard">
            {/* Sidebar navigation will be added here */}
            <main className="user-main-content">
                {children}
            </main>
        </div>
    );
}
