"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signInFormSchema } from "@/app/api/authentication/schema";
import { getSession, signIn } from "next-auth/react";
import { useLocale } from "next-intl";
import { showToastError } from "@/components/templates/SweetAlert";
import Image from "next/image";

interface SignInPageProps {}

const SignInPage: FC<SignInPageProps> = () => {
	const [isLoading, setIsLoading] = React.useState(false);
	const locale = useLocale();

	const form = useForm<z.infer<typeof signInFormSchema>>({
		resolver: zodResolver(signInFormSchema),
	});

	const router = useRouter();

	const onSubmit = async (val: z.infer<typeof signInFormSchema>) => {
		console.log('xx', process.env.NEXT_PUBLIC_API_URL)
		
		setIsLoading(true);
		const data = {
			email: val.email,
			device_id: val.email,
			device_name: val.email,
			password: val.password
		}

		const authenticated = await signIn("credentials", {
			...data,
			redirect: false,
		});

		if (authenticated?.error) {
			setIsLoading(false);
            showToastError("Email atau password salah");
			return;
		}

		const session = await getSession();

		if (session) {
			localStorage.setItem("token", session.token);
			localStorage.setItem("employeeCode", session.user.employeeCode)
		}

		router.push(`/${locale}/validate-roles`);
		setIsLoading(false);
	};

	return (
		<div className="relative w-full h-screen bg-primary md:bg-white">
			<div className="flex flex-col md:flex-row items-center justify-around w-full h-full">
				<div className="bg-primary w-full md:w-[50%] h-[50%] md:h-full hidden md:flex items-center justify-center">
					<Image src="/images/login.svg" width={400} height={500} alt="Login picture" className="max-w-full h-auto"/>
				</div>
				<div className="w-full md:w-[50%] flex items-center justify-center p-4">
					<div className="border border-border rounded-md p-5 w-full max-w-[400px] bg-white">
						<div className="font-semibold text-center text-lg md:text-2xl mb-2">
							Selamat datang di Zakiah 
						</div>
						<div className="text-xs md:text-base text-gray-500 text-center">
							Masukan email untuk mendapatkan <br />
							akses dashboard dan POS
						</div>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="mt-5 space-y-5"
							>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													placeholder="Masukkan email..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="password"
													placeholder="Masukkan password..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button className="w-full text-xs md:text-base" disabled={isLoading ? true : false}>{isLoading ? 'Loading...' : 'Sign in'}</Button>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignInPage;
