import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as stateLogin } from '../store/authslice.js'
import { Button, Input, Logoimage } from './index.js'
import { useDispatch } from 'react-redux'
import authservice from '../appwrite/auth.js'
import { useForm } from 'react-hook-form'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")

    const login = async (data) => {
        setError("")
        try {
            const session = await authservice.login(data)
            if (session) {
                const userData = await authservice.getCurrentUser()
                if (userData) dispatch(stateLogin(userData))
                navigate('/')
            }
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="flex items-center justify-center w-full min-h-screen px-4 sm:px-6 py-8 bg-zinc-900">
            <div className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-lg bg-zinc-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 border border-zinc-700 shadow-lg">
                <div className="mb-2 sm:mb-4 flex justify-center">
                    <span className="inline-block w-16 sm:w-20 md:w-full max-w-[100px]">
                       <img src={Logoimage} alt="Cashew AI" />
                    </span>
                </div>
                <h2 className="text-center text-xl sm:text-2xl font-bold text-white">Sign in to your account</h2>
                <p className="mt-1 sm:mt-2 text-center text-sm sm:text-base text-neutral-400">
                    Don&apos;t have an account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-[#48726b] hover:underline transition"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className="text-red-500 mt-4 sm:mt-6 text-center text-sm sm:text-base">{error}</p>}

                <form onSubmit={handleSubmit(login)} className="mt-6 sm:mt-8">
                    <div className="space-y-4 sm:space-y-5">
                        <Input
                            label="Email:"
                            placeholder="Enter your email"
                            type="email"
                            className="bg-zinc-900 text-white placeholder-neutral-500 text-sm sm:text-base"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                },
                            })}
                        />
                        <Input
                            label="Password:"
                            type="password"
                            placeholder="Enter your password"
                            className="bg-zinc-900 text-white placeholder-neutral-500 text-sm sm:text-base"
                            {...register("password", { required: true })}
                        />
                        <Button
                            type="submit"
                            className="w-full bg-[#48726b] text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base transition hover:bg-[#3a5d57] focus:ring-2 focus:ring-[#48726b] focus:ring-opacity-50"
                        >
                            Sign in
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login