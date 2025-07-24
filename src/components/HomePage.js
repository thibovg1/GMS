// src/components/HomePage.js
import React from 'react';
import { PhoneCallIcon, UsersIcon, BellRingIcon } from '../icons'; // Assuming icons are in a separate file or directly imported as SVG

const HomePage = ({ onNavigate }) => (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-2xl shadow-2xl max-w-4xl mx-auto mt-12 border border-gray-700">
        <h2 className="text-4xl font-extrabold text-blue-400 mb-8 text-center leading-tight">Welkom bij het GMS Systeem</h2>
        <p className="text-xl text-gray-300 text-center mb-10 max-w-2xl">
            Dit is een geavanceerd geïntegreerd meldkamer systeem voor surveillance servers, ontworpen om naadloze communicatie tussen burgers, hulpdiensten en de meldkamer te faciliteren.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <button
                onClick={() => onNavigate('citizen')}
                className="flex flex-col items-center p-8 bg-green-700 text-white rounded-xl shadow-lg hover:bg-green-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 border-b-4 border-green-900"
            >
                <PhoneCallIcon className="w-14 h-14 mb-4" />
                <span className="text-2xl font-bold">Burger Portaal</span>
                <span className="text-base mt-2 opacity-90">Meld een incident of noodsituatie</span>
            </button>
            <button
                onClick={() => onNavigate('emergency')}
                className="flex flex-col items-center p-8 bg-blue-700 text-white rounded-xl shadow-lg hover:bg-blue-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 border-b-4 border-blue-900"
            >
                <UsersIcon className="w-14 h-14 mb-4" />
                <span className="text-2xl font-bold">Hulpdienst Portaal</span>
                <span className="text-base mt-2 opacity-90">Beheer uw status en toegewezen incidenten</span>
            </button>
            <button
                onClick={() => onNavigate('controlroom')}
                className="flex flex-col items-center p-8 bg-orange-700 text-white rounded-xl shadow-lg hover:bg-orange-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 border-b-4 border-orange-900"
            >
                <BellRingIcon className="w-14 h-14 mb-4" />
                <span className="text-2xl font-bold">Meldkamer Portaal</span>
                <span className="text-base mt-2 opacity-90">Centraal overzicht en beheer van alle operaties</span>
            </button>
        </div>
    </div>
);

export default HomePage;