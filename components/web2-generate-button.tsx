"use client"

interface Web2GenerateButtonProps {
  type?: "button" | "submit" | "reset"
  disabled?: boolean
}

const Web2GenerateButton = ({ type = "button", disabled = false }: Web2GenerateButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`relative cursor-pointer border-none w-[160px] h-[48px] bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all duration-300 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      Generate Website
    </button>
  )
}

export default Web2GenerateButton
