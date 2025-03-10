import { useCallback, useEffect, useMemo, useState } from "react";

interface UsePromiseTrackerProps<T> {
    progress: number;
    error: Error | null;
    results: T[];
    loading: boolean;
}
//? making type generic of <T>[] because we recieve array of promise and results in form of array also.
export const usePromiseTracker = <T,>(promises: Promise<T>[]): UsePromiseTrackerProps<T> => {
    const [progress, setProgress] = useState<number>(0);
    const [results, setResults] = useState<T[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Memoize promises to prevent unnecessary re-renders
    const memoizedPromises = useMemo(() => promises, [promises]);

    const trackPromise = useCallback(async () => {
        if (!memoizedPromises.length) return; // If no promises, do nothing

        let completed = 0;
        const updateProgress = (increment: number) => {
            completed += increment;
            setProgress(Math.floor((completed / memoizedPromises.length) * 100)); //1/3*100;
        };

        setLoading(true);
        try {
            const results = await Promise.all(
                memoizedPromises.map((promise) =>
                    promise.then((result) => {
                        updateProgress(1); // update progress when one promise solve
                        return result;
                    })
                )
            );
            setResults(results);
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    }, [memoizedPromises]);

    useEffect(() => {
        trackPromise();

        return () => {
            // Only reset state if the component unmounts, not on every promise change
            if (!memoizedPromises.length) {
                setError(null);
                setResults([]);
                setProgress(0);
            }
        };
    }, [memoizedPromises.length]);

    return { progress, error, results, loading };
};
