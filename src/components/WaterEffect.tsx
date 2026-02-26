"use client";

import { useEffect, useRef } from "react";

export default function WaterEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        class Ripple {
            x: number;
            y: number;
            radius: number;
            maxRadius: number;
            alpha: number;
            speed: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.radius = 0;
                this.maxRadius = Math.random() * 80 + 40;
                this.alpha = 0.6;
                this.speed = Math.random() * 1.5 + 1.5;
            }

            draw() {
                if (!ctx) return;

                const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
                const colorBase = isLightMode ? '0, 0, 0' : '255, 255, 255';

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

                ctx.strokeStyle = `rgba(${colorBase}, ${this.alpha * 0.3})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.fillStyle = `rgba(${colorBase}, ${this.alpha * 0.03})`;
                ctx.fill();

                // Inner specular reflection ring
                if (this.radius > 10) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius - 8, 0, Math.PI * 2, false);
                    ctx.strokeStyle = `rgba(${colorBase}, ${this.alpha * 0.1})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            update() {
                this.radius += this.speed;
                this.alpha -= 0.015;
            }
        }

        let ripples: Ripple[] = [];
        let lastX = 0;
        let lastY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Create ripple trail sparsely to prevent canvas lag
            if (distance > 30) {
                ripples.push(new Ripple(e.clientX, e.clientY));
                lastX = e.clientX;
                lastY = e.clientY;
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener("resize", resize);

        let animationId: number;
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < ripples.length; i++) {
                ripples[i].update();
                ripples[i].draw();

                if (ripples[i].alpha <= 0 || ripples[i].radius >= ripples[i].maxRadius) {
                    ripples.splice(i, 1);
                    i--;
                }
            }
            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none", // Allows clicking through the canvas
                zIndex: 9999, // Floating above everything
            }}
        />
    );
}
