import React from 'react'

function Button(
    {
        children,
        type = 'button',
        bgColor = 'bg-[#48726b]',
        textColor = 'text-white',
        hoverColor = 'hover:bg-[#3b5a4e]',
       
        className = '',

        ...props
    }
) {
    return (
        <button className={`px-4 py-2 rounded-lg cursor-pointer ${bgColor} ${textColor} ${hoverColor} ${className}`} {...props}>
            {children}
        </button>
    )
}

export default Button