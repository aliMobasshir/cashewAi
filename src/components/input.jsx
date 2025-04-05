import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
    label,
    type = "text",
    className = "",
    ...props
}, ref) {
    const id = useId()
    return (
        <div className="w-full">
            {label && (
                <label
                    className="inline-block mb-1 pl-1 text-white"
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id}
                ref={ref}
                className={`px-4 py-3 rounded-lg bg-zinc-900 text-white placeholder-neutral-500 border border-zinc-700 outline-none focus:ring-2 focus:ring-[#48726b] transition duration-200 w-full ${className}`}
                {...props}
            />
        </div>
    )
})

export default Input
