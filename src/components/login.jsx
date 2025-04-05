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
        <div className="flex items-center justify-center w-full min-h-screen bg-zinc-900">
            <div className="mx-auto w-full max-w-lg bg-zinc-800 rounded-2xl p-10 border border-zinc-700 shadow-lg">
                <div className="mb-4 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                       <img src={Logoimage} alt="Cashew AI" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold text-white">Sign in to your account</h2>
                <p className="mt-2 text-center text-neutral-400">
                    Don&apos;t have an account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-[#48726b] hover:underline transition"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className="text-red-500 mt-6 text-center">{error}</p>}

                <form onSubmit={handleSubmit(login)} className="mt-8">
                    <div className="space-y-5">
                        <Input
                            label="Email:"
                            placeholder="Enter your email"
                            type="email"
                            className="bg-zinc-900 text-white placeholder-neutral-500"
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
                            className="bg-zinc-900 text-white placeholder-neutral-500"
                            {...register("password", { required: true })}
                        />
                        <Button
                            type="submit"
                            className="w-full bg-[#48726b]  text-white font-semibold py-3 rounded-xl transition"
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
