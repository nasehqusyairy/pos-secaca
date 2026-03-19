"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaFileExcel } from "react-icons/fa";

interface CustomUploadFileImportProps {
	form: any;
	name: string;
	uploadError: string;
	onFileChange?: (file: string) => void
}

export default function CustomUploadFileImport({ form, name, uploadError, onFileChange }: CustomUploadFileImportProps) {
	const [file, setFile] = useState("");
	const [error, setError] = useState(uploadError);

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (onFileChange && file) {
			onFileChange(file)
		}
	}, [ file ])

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			// cheeck if exsist file
			if (!e.target.files[0]) {
				return;
			}
			// cheeck if file xlsx
			if (e.target.files[0]?.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
				setError("File must be xlsx");

				return;
			} else {
				setError("")
			}

			form.setValue(name, e.target.files[0]);
			setFile(e.target.files[0].name)
		}
	};

	const handleUploadFile = () => {
		inputRef.current?.click();
	};

	return (
		<>
			<div
				className="py-6 px-8 border-2 cursor-pointer border-bluePrimary border-dashed rounded-sm flex items-center flex-col justify-center w-[450px]"
				onClick={handleUploadFile}
			>
				<FaFileExcel className="w-[30px] h-[30px] items-center mb-4" />
				<div className="text-center">
					<span className="text-bluePrimary font-medium">
						Click to replace
					</span>{" "}
					<span className="text-gray-500">or drag and drop</span>
				</div>
				<div className="text-gray-600 text-sm">
					xlsx
				</div>
				<input
					ref={inputRef}
					type="file"
					className="hidden"
					onChange={handleFileChange}
				/>
			</div>
			{error && <p className="text-red-500 mt-2">{error}</p>}
			{file && <p className="mt-2">File: {file}</p>}
		</>
	)
}
