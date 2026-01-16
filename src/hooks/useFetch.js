
'use client';

import { useEffect, useState } from 'react';

export function useFetch(fn, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fn();
                if (alive) setData(res);
            } catch (e) {
                if (alive) setError(e);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, deps);

    return { data, loading, error };
}
``
