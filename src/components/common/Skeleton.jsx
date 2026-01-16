import React from "react";

/**
 * A reusable Skeleton component using Bootstrap 5 placeholder classes.
 */
export default function Skeleton({
    variant = "text", // text | card | table | avatar
    className = "",
    lines = 1,
    height,
    width
}) {
    const baseClass = `placeholder-glow ${className}`;

    if (variant === "card") {
        return (
            <div className={`card overflow-hidden border-0 shadow-sm ${baseClass}`} style={{ minHeight: '300px' }}>
                <div className="placeholder col-12" style={{ height: '200px' }}></div>
                <div className="card-body">
                    <h5 className="card-title placeholder-glow">
                        <span className="placeholder col-6"></span>
                    </h5>
                    <p className="card-text placeholder-glow">
                        <span className="placeholder col-7 me-1"></span>
                        <span className="placeholder col-4"></span>
                        <span className="placeholder col-4 me-1"></span>
                        <span className="placeholder col-6"></span>
                    </p>
                </div>
            </div>
        );
    }

    if (variant === "table") {
        return (
            <div className={baseClass}>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <th key={i}><span className="placeholder col-12"></span></th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: lines }).map((_, i) => (
                                <tr key={i}>
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <td key={j}><span className="placeholder col-12"></span></td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (variant === "avatar") {
        return (
            <div className={baseClass}>
                <span
                    className="placeholder rounded-circle"
                    style={{
                        width: width || '48px',
                        height: height || '48px',
                        display: 'inline-block'
                    }}
                ></span>
            </div>
        );
    }

    return (
        <div className={baseClass}>
            {Array.from({ length: lines }).map((_, i) => (
                <span
                    key={i}
                    className="placeholder col-12 d-block mb-2"
                    style={{ height: height || '1em', width: width || '100%' }}
                ></span>
            ))}
        </div>
    );
}
