const validateRedirectTarget = (target: string | null): string => {
    if (!target) {
        // If the return path was not specified, default to /.
        return '/';
    }
    if (!target.startsWith('/') || target.startsWith('//')) {
        // If the return path attempts to redirect us to an external site, default to /.
        return '/';
    }
    return target;
};

export default validateRedirectTarget;
