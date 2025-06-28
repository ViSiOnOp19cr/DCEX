"use client";

export const PrimaryButton = ({children, onClick, disabled = false}: {
    children: React.ReactNode,
    onClick: () => void,
    disabled?: boolean
}) => {
    return <button 
        onClick={onClick} 
        disabled={disabled}
        type="button" 
        className={`font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 transition-all ${
            disabled 
                ? "text-gray-400 bg-gray-200 cursor-not-allowed" 
                : "text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300"
        }`}>
        {children}
    </button>
}

export const SecondaryButton = ({children, onClick, prefix}: {
    children: React.ReactNode,
    onClick: () => void,
    prefix?: React.ReactNode
}) => {
    return <button onClick={onClick} type="button" className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3 me-2 mb-2 inline-flex items-center justify-center transition-all">
        {prefix && <div className="mr-2">{prefix}</div>}
        <div className="flex items-center">{children}</div>
    </button>
}

export const TabButton = ({active, children, onClick}: {
    active: boolean;
    children: React.ReactNode,
    onClick: () => void
}) => {
    return <button type="button" className={`whitespace-nowrap text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 md:px-5 py-2.5 me-2 mb-2 ${active ? "bg-blue-500" : "bg-blue-300"}`} onClick={onClick}>{children}</button>
}