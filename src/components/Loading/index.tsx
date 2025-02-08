import "./index.css";


interface ComponentProps {
    size: number;
}

export default function Loading({ size }: ComponentProps) {
    return (
        <div className="loading-container">
            <svg
                className="loading-spinner"
                style={{ width: `${size}rem`, height: `${size}rem` }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="spinner-circle"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="spinner-path"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
            </svg>
        </div>
    );
}
