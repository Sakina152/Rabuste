import React, { useEffect, useState } from 'react';
import 'aframe';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, View, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import vrImage from '@/assets/vr-cafe.jpg';

// TypeScript definition for custom elements to prevent errors
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'a-scene': any;
            'a-sky': any;
            'a-camera': any;
            'a-cursor': any;
            'a-entity': any;
            'a-sphere': any;
            'a-text': any;
            'a-plane': any;
            'a-animation': any;
            'a-assets': any;
        }
    }
}

const VirtualTour = () => {
    const navigate = useNavigate();
    const [showOverlay, setShowOverlay] = useState(true);

    // Example interaction handler
    const handleHotspotClick = (message: string) => {
        alert(message);
    };

    useEffect(() => {
        // Ensure A-Frame cursor component works with React events if needed
        // Typically JSX onClick works on a-entities if the raycaster is set up correctly
    }, []);

    return (
        <div className="w-full h-screen relative bg-black">
            {/* UI Overlay - Navigation */}
            <div className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none">
                <Button
                    variant="secondary"
                    className="pointer-events-auto shadow-lg backdrop-blur-md bg-white/90 hover:bg-white"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>
            </div>

            {/* Instructions Overlay */}
            {showOverlay && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
                    <div className="bg-card text-card-foreground p-8 rounded-2xl max-w-md text-center border border-border shadow-2xl">
                        <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6">
                            <View className="w-8 h-8 text-accent" />
                        </div>
                        <h2 className="text-3xl font-display font-bold mb-4">Virtual Tour</h2>
                        <p className="text-muted-foreground mb-8">
                            Experience our café in 360°. Drag to look around, and click on hotspots to interact with items.
                        </p>
                        <Button
                            size="lg"
                            className="w-full bg-accent hover:bg-accent/90 text-white font-semibold"
                            onClick={() => setShowOverlay(false)}
                        >
                            Enter Experience
                        </Button>
                    </div>
                </div>
            )}

            {/* VR Scene */}
            <a-scene embedded className="w-full h-full">
                {/* Assets Management */}
                <a-assets>
                    <img id="sky" src={vrImage} crossOrigin="anonymous" />
                </a-assets>

                {/* 360 Sky Background */}
                <a-sky src="#sky" rotation="0 -130 0"></a-sky>

                {/* Camera & Cursor */}
                <a-camera position="0 1.6 0" wasd-controls-enabled="false">
                    <a-cursor
                        color="white"
                        fuse="true"
                        fuse-timeout="1500"
                        raycaster="objects: .clickable"
                        animation__click="property: scale; startEvents: click; easing: easeInCubic; dur: 150; from: 0.1 0.1 0.1; to: 1 1 1"
                        animation__fusing="property: scale; startEvents: fusing; easing: easeInCubic; dur: 1500; from: 1 1 1; to: 0.1 0.1 0.1"
                        animation__mouseleave="property: scale; startEvents: mouseleave; easing: easeInCubic; dur: 500; to: 1 1 1"
                    ></a-cursor>
                </a-camera>

                {/* Hotspot 1: Art Piece */}
                {/* Using a sphere as a visual anchor */}
                <a-entity position="-3 1.5 -4" rotation="0 30 0" className="clickable"
                    onClick={() => handleHotspotClick("Abstract Coffee Art: A masterpiece depicting the flow of espresso. Price: ₹5,000")}>
                    <a-sphere radius="0.4" color="#D4C4A8" material="opacity: 0.8; transparent: true"
                        animation="property: scale; to: 1.1 1.1 1.1; dir: alternate; loop: true; dur: 2000">
                    </a-sphere>
                    <a-text value="Art Piece" align="center" position="0 0.8 0" width="6" color="#FFF" font="koverwatch" side="double"></a-text>
                </a-entity>

                {/* Hotspot 2: Menu/Counter */}
                <a-entity position="4 1 -2" rotation="0 -60 0" className="clickable"
                    onClick={() => handleHotspotClick("Welcome to the Counter! Check out our menu for the latest brews.")}>
                    <a-sphere radius="0.4" color="#8B4513" material="opacity: 0.9; transparent: true"
                        animation="property: position; to: 4 1.2 -2; dir: alternate; loop: true; dur: 3000">
                    </a-sphere>
                    <a-text value="Service Counter" align="center" position="0 0.8 0" width="6" color="#FFF" side="double"></a-text>
                </a-entity>

                {/* Hotspot 3: Seating Area */}
                <a-entity position="0 0.5 5" rotation="0 180 0" className="clickable"
                    onClick={() => handleHotspotClick("Cozy Seating: Perfect for remote work or a casual chat over coffee.")}>
                    <a-plane width="1.5" height="0.5" color="#000" material="opacity: 0.6" position="0 0.3 0"></a-plane>
                    <a-text value="Seating Area" align="center" position="0 0.3 0.1" width="5" color="#FFF"></a-text>
                </a-entity>

            </a-scene>
        </div>
    );
};

export default VirtualTour;
