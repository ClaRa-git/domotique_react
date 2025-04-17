import React from "react";
import { BarLoader } from "react-spinners";

// Affiche un loader de page lorsque l'application est en cours de chargement
const PageLoader = () => {

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-[#1c1a26] text-white">
		{/* Logo Hoomy */}
		<div className="text-center mb-6">
			<h1 className="text-6xl font-bold tracking-wide">
				<span className="text-secondary-orange">h</span>oomy
				<span className="text-secondary-orange">.</span>
			</h1>
			<p className="text-sm mt-2 text-[#dfe4ea]">
				L’émotion au cœur de votre ambiance.
			</p>
		</div>
			<BarLoader
				color='#f08a4f'          
			/>
		</div>
	);
};

export default PageLoader;
