"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ParticleBackground = () => {
  useEffect(() => {
    // Canvas setup
    const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle configuration
    type Particle = {
      x: number;
      y: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
      opacity: number;
    };

    const particles: Particle[] = [];
    const particleCount = 100;
    const colors = ['#6366F1', '#8B5CF6', '#3B82F6', '#60A5FA'];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 4 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(')', `, ${particle.opacity})`).replace('rgb', 'rgba');
        ctx.fill();
      });
      
      // Connect particles with lines if they're close enough
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return <canvas id="particles-canvas" className="fixed top-0 left-0 w-full h-full -z-10" />;
};

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  console.log(user);

  useEffect(() => {
    const role = user?.publicMetadata.role;

    if (role) {
      router.push(`/${role}`);
    }
  }, [user, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-30 w-32 h-32 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-12 rounded-2xl shadow-2xl flex flex-col gap-3 w-full max-w-md relative z-10 border border-gray-100"
        >
          <h1 className="text-2xl font-bold flex items-center gap-3 mb-1">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-1">
              <Image src="/logo.png" alt="SchooLama Logo" width={28} height={28} className="rounded-full" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              BodaySchool
            </span>
          </h1>
          
          <h2 className="text-gray-500 mb-3">Masuk ke akun pembelajaran Anda</h2>
          
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4"></div>
          
          <Clerk.GlobalError className="text-sm text-red-500 bg-red-50 p-2 rounded-md" />
          
          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs font-medium text-gray-600">
              Username
            </Clerk.Label>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <Clerk.Input
                type="text"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="Masukkan username"
              />
            </div>
            <Clerk.FieldError className="text-xs text-red-500" />
          </Clerk.Field>
          
          <Clerk.Field name="password" className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Clerk.Label className="text-xs font-medium text-gray-600">
                Password
              </Clerk.Label>
              <a href="#" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                Lupa password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <Clerk.Input
                type="password"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="Masukkan password"
              />
            </div>
            <Clerk.FieldError className="text-xs text-red-500" />
          </Clerk.Field>
          
          <SignIn.Action
            submit
            className="mt-3 py-2.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transform transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Masuk
          </SignIn.Action>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            Belum memiliki akun? <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Daftar sekarang</a>
          </div>
        </SignIn.Step>
      </SignIn.Root>
      
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;