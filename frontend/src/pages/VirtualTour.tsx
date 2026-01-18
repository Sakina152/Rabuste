import React, { useEffect, useState } from 'react';
import 'aframe';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, View } from 'lucide-react';
import { Button } from '@/components/ui/button';
import vrImage from '@/assets/vr-cafe.jpg';

// TypeScript definitions for A-Frame elements
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'a-scene': any;
            'a-sky': any;
            'a-camera': any;
            'a-cursor': any;
            'a-entity': any;
            'a-text': any;
            'a-plane': any;
            'a-assets': any;
        }
    }
}

const VirtualTour = () => {
    const navigate = useNavigate();
    const [showOverlay, setShowOverlay] = useState(true);

    // ✅ BEST FIX: Native A-Frame click listeners
    useEffect(() => {
        const gallery = document.querySelector('#gallery-hotspot');
        const menu = document.querySelector('#menu-hotspot');
        const workshops = document.querySelector('#workshops-hotspot');
        const franchise = document.querySelector('#franchise-hotspot');

        gallery?.addEventListener('click', () => navigate('/gallery'));
        menu?.addEventListener('click', () => navigate('/menu'));
        workshops?.addEventListener('click', () => navigate('/workshops'));
        franchise?.addEventListener('click', () => navigate('/franchise'));

        return () => {
            gallery?.removeEventListener('click', () => { });
            menu?.removeEventListener('click', () => { });
            workshops?.removeEventListener('click', () => { });
            franchise?.removeEventListener('click', () => { });
        };
    }, [navigate]);

    return (
        <div className="w-full h-screen relative bg-black">

            {/* Top UI */}
            <div className="absolute top-0 left-0 w-full z-50 p-6 pointer-events-none">
                <Button
                    variant="secondary"
                    className="pointer-events-auto bg-white/90 shadow-lg"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>
            </div>

            {/* Intro Overlay */}
            {showOverlay && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60">
                    <div className="bg-card p-8 rounded-2xl max-w-md text-center shadow-2xl">
                        <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6">
                            <View className="w-8 h-8 text-accent" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Virtual Tour</h2>
                        <p className="text-muted-foreground mb-8">
                            Click the floating panels to explore the café.
                        </p>
                        <Button
                            size="lg"
                            className="w-full bg-accent text-white"
                            onClick={() => setShowOverlay(false)}
                        >
                            Enter Experience
                        </Button>
                    </div>
                </div>
            )}

            {/* VR Scene */}
            <a-scene
                embedded
                className="w-full h-full"
                cursor="rayOrigin: mouse"
                raycaster="objects: .clickable"
            >
                <a-assets>
                    <img id="sky" src={vrImage} crossOrigin="anonymous" />
                </a-assets>

                <a-sky src="#sky" rotation="0 -130 0" />

                {/* Camera */}
                <a-camera position="0 1.6 0" wasd-controls-enabled="false">
                    <a-cursor rayOrigin="mouse" fuse="false" />
                </a-camera>

                {/* Gallery */}
                <a-entity
                    id="gallery-hotspot"
                    position="-3 1.5 -4"
                    rotation="0 30 0"
                    className="clickable"
                    animation__mouseenter="property: scale; to: 1.05 1.05 1.05; dur: 200; startEvents: mouseenter"
                    animation__mouseleave="property: scale; to: 1 1 1; dur: 200; startEvents: mouseleave"
                >
                    <a-plane width="2.8" height="1" color="#1a1a1a" material="opacity: 0.8; transparent: true; side: double; shader: flat">
                        <a-text value="ART GALLERY" align="center" width="5" color="#FFD700" position="0 0.1 0.01" font="exo2bold"></a-text>
                        <a-text value="Explore Masterpieces" align="center" width="3" color="#ccc" position="0 -0.2 0.01"></a-text>
                        {/* Decorative bottom bar */}
                        <a-plane position="0 -0.45 0.02" width="2.8" height="0.05" color="#FFD700"></a-plane>
                    </a-plane>
                </a-entity>

                {/* Menu */}
                <a-entity
                    id="menu-hotspot"
                    position="4 1 -2"
                    rotation="0 -60 0"
                    className="clickable"
                    animation__mouseenter="property: scale; to: 1.05 1.05 1.05; dur: 200; startEvents: mouseenter"
                    animation__mouseleave="property: scale; to: 1 1 1; dur: 200; startEvents: mouseleave"
                >
                    <a-plane width="2.8" height="1" color="#1a1a1a" material="opacity: 0.8; transparent: true; side: double; shader: flat">
                        <a-text value="OUR MENU" align="center" width="5" color="#D4A373" position="0 0.1 0.01" font="exo2bold"></a-text>
                        <a-text value="Fresh Brews & Snacks" align="center" width="3" color="#ccc" position="0 -0.2 0.01"></a-text>
                        <a-plane position="0 -0.45 0.02" width="2.8" height="0.05" color="#D4A373"></a-plane>
                    </a-plane>
                </a-entity>

                {/* Workshops */}
                <a-entity
                    id="workshops-hotspot"
                    position="0 0.5 5"
                    rotation="0 180 0"
                    className="clickable"
                    animation__mouseenter="property: scale; to: 1.05 1.05 1.05; dur: 200; startEvents: mouseenter"
                    animation__mouseleave="property: scale; to: 1 1 1; dur: 200; startEvents: mouseleave"
                >
                    <a-plane width="2.8" height="1" color="#1a1a1a" material="opacity: 0.8; transparent: true; side: double; shader: flat">
                        <a-text value="WORKSHOPS" align="center" width="5" color="#4A90E2" position="0 0.1 0.01" font="exo2bold"></a-text>
                        <a-text value="Join our Events" align="center" width="3" color="#ccc" position="0 -0.2 0.01"></a-text>
                        <a-plane position="0 -0.45 0.02" width="2.8" height="0.05" color="#4A90E2"></a-plane>
                    </a-plane>
                </a-entity>

                {/* Franchise */}
                <a-entity
                    id="franchise-hotspot"
                    position="-5 1.5 2"
                    rotation="0 90 0"
                    className="clickable"
                    animation__mouseenter="property: scale; to: 1.05 1.05 1.05; dur: 200; startEvents: mouseenter"
                    animation__mouseleave="property: scale; to: 1 1 1; dur: 200; startEvents: mouseleave"
                >
                    <a-plane width="2.8" height="1" color="#1a1a1a" material="opacity: 0.8; transparent: true; side: double; shader: flat">
                        <a-text value="FRANCHISE" align="center" width="5" color="#E74C3C" position="0 0.1 0.01" font="exo2bold"></a-text>
                        <a-text value="Partner With Us" align="center" width="3" color="#ccc" position="0 -0.2 0.01"></a-text>
                        <a-plane position="0 -0.45 0.02" width="2.8" height="0.05" color="#E74C3C"></a-plane>
                    </a-plane>
                </a-entity>

            </a-scene>
        </div>
    );
};

export default VirtualTour;
