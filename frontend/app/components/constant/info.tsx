

interface InfoIconProps {
    detail: string
}


export const InfoIcon = ({detail}: InfoIconProps) => {
    return (
        <svg
        className={`w-6 h-6 `}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v2m0 4h.01m0 4h-.01M12 18v2"
        ></path>
        </svg>
    );
    }