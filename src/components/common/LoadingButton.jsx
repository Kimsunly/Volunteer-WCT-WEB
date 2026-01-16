import React from "react";

/**
 * A button component that displays a spinner when loading.
 */
export default function LoadingButton({
    loading = false,
    children,
    className = "btn btn-primary",
    loadingText,
    disabled,
    ...props
}) {
    return (
        <button
            className={className}
            disabled={loading || disabled}
            {...props}
        >
            {loading ? (
                <>
                    <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                    ></span>
                    {loadingText || children}
                </>
            ) : (
                children
            )}
        </button>
    );
}
