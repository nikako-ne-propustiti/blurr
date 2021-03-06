import React from "react";

interface Props {
    callback: ((scrollHeight?: number) => void)
};

const InfiniteScroll: React.FC<Props> = ({ callback }) => {
    const prevScrollY = React.useRef(0);
    const [goingUp, setGoingUp] = React.useState(true);

    const onScroll = React.useCallback(() => {
        const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
        if (prevScrollY.current < scrollHeight && goingUp)
            setGoingUp(false);
        if (prevScrollY.current > scrollHeight && !goingUp)
            setGoingUp(true);
        if (scrollTop + clientHeight > scrollHeight - 5 && !goingUp) {
            callback(scrollHeight);
            setGoingUp(true);
        }
        prevScrollY.current = scrollHeight;
    }, [goingUp]);

    React.useEffect(() => {
        // Removes old event
        window.removeEventListener('scroll', onScroll);
        // Adds ours
        window.addEventListener('scroll', onScroll, { passive: true });
        // Returns removing our event on component unload
        return () => window.removeEventListener('scroll', onScroll);
    }, [goingUp]);

    return <></>
}

export default InfiniteScroll;
